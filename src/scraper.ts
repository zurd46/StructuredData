import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { URL } from 'url';
import { logger } from './utils/logger';
import { StructuredDataExtractor } from './extractors/structured-data-extractor';
import { AIContentGenerator } from './generators/ai-content-generator';
import { SchemaValidator } from './utils/schema-validator';

export interface ScraperOptions {
  outputDir?: string;
  force?: boolean;
  openaiApiKey?: string;
  headless?: boolean;
}

export interface AnalysisResult {
  success: boolean;
  url: string;
  outputPath?: string;
  structuredDataCount?: number;
  generated?: boolean;
  error?: string;
}

export class StructuredDataScraper {
  private browser?: Browser;
  private options: Required<ScraperOptions>;

  constructor(options: ScraperOptions = {}) {
    this.options = {
      outputDir: options.outputDir || './output',
      force: options.force || false,
      openaiApiKey: options.openaiApiKey || '',
      headless: options.headless !== false
    };
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      // Validate URL
      const validUrl = this.validateUrl(url);
      logger.info(`🌐 Validated URL: ${validUrl}`);

      // Initialize browser
      await this.initBrowser();
      const page = await this.browser!.newPage();

      // Navigate to page
      logger.info(`📄 Loading page...`);
      await page.goto(validUrl, { waitUntil: 'networkidle2' });

      // Extract existing structured data
      const extractor = new StructuredDataExtractor();
      const existingData = await extractor.extractFromPage(page);

      let structuredData = existingData;
      let generated = false;

      // Check if we need to generate structured data
      if (existingData.length === 0 || this.options.force) {
        if (existingData.length === 0) {
          logger.info(`🔍 No structured data found, generating with AI...`);
        } else {
          logger.info(`🔄 Force mode enabled, regenerating structured data...`);
        }

        // Extract page content for AI analysis
        const pageContent = await this.extractPageContent(page);
        
        // Generate structured data using AI
        const generator = new AIContentGenerator(this.options.openaiApiKey);
        structuredData = await generator.generateStructuredData(validUrl, pageContent);
        generated = true;
      } else {
        logger.info(`✅ Found ${existingData.length} existing structured data entries`);
      }

      // Save results
      const outputPath = await this.saveResults(validUrl, structuredData, generated);

      await this.cleanup();

      return {
        success: true,
        url: validUrl,
        outputPath,
        structuredDataCount: structuredData.length,
        generated
      };

    } catch (error) {
      await this.cleanup();
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async validateStructuredData(filePath: string): Promise<boolean> {
    try {
      const validator = new SchemaValidator();
      return await validator.validateFile(filePath);
    } catch (error) {
      logger.error(`Validation error: ${error}`);
      return false;
    }
  }

  private validateUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }
      return urlObj.toString();
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  private async initBrowser(): Promise<void> {
    if (!this.browser) {
      logger.info(`🚀 Starting browser...`);
      this.browser = await puppeteer.launch({
        headless: this.options.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
    }
  }

  private async extractPageContent(page: Page): Promise<any> {
    return await page.evaluate(() => {
      // Extract basic page information
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      
      // Extract main content
      const content = document.body.innerText;
      
      // Extract contact information patterns
      const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const phones = content.match(/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g) || [];
      
      // Extract social media links
      const socialLinks = Array.from(document.querySelectorAll('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]'))
        .map(link => (link as HTMLAnchorElement).href);

      // Extract headings for structure
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(h => ({ tag: h.tagName, text: h.textContent?.trim() }));

      return {
        title,
        description,
        keywords,
        content: content.substring(0, 5000), // Limit content size
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        socialLinks: [...new Set(socialLinks)],
        headings,
        url: window.location.href
      };
    });
  }

  private async saveResults(url: string, structuredData: any[], generated: boolean): Promise<string> {
    // Ensure output directory exists
    await fs.mkdir(this.options.outputDir, { recursive: true });

    // Create filename from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${hostname}_${timestamp}.json`;
    const outputPath = path.join(this.options.outputDir, filename);

    // Prepare output data
    const outputData = {
      metadata: {
        url,
        analyzedAt: new Date().toISOString(),
        generated,
        structuredDataCount: structuredData.length
      },
      structuredData
    };

    // Save to file
    await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
    
    return outputPath;
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
  }
}
