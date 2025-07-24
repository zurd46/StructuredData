import { Page } from 'puppeteer';
import { logger } from '../utils/logger';

export interface StructuredDataItem {
  type: string;
  data: any;
  format: 'json-ld' | 'microdata' | 'rdfa';
  source: 'script' | 'meta' | 'inline';
}

export class StructuredDataExtractor {
  
  async extractFromPage(page: Page): Promise<StructuredDataItem[]> {
    try {
      logger.info('🔍 Extracting structured data from page...');
      
      const structuredData = await page.evaluate(() => {
        const results: StructuredDataItem[] = [];

        // Extract JSON-LD structured data
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        jsonLdScripts.forEach((script, index) => {
          try {
            const content = script.textContent || script.innerHTML;
            if (content.trim()) {
              const data = JSON.parse(content);
              results.push({
                type: data['@type'] || 'Unknown',
                data: data,
                format: 'json-ld',
                source: 'script'
              });
            }
          } catch (error) {
            console.warn(`Failed to parse JSON-LD script ${index}:`, error);
          }
        });

        // Extract Open Graph meta tags
        const ogTags = document.querySelectorAll('meta[property^="og:"]');
        if (ogTags.length > 0) {
          const ogData: any = {};
          ogTags.forEach(tag => {
            const property = tag.getAttribute('property');
            const content = tag.getAttribute('content');
            if (property && content) {
              ogData[property] = content;
            }
          });
          
          if (Object.keys(ogData).length > 0) {
            results.push({
              type: 'OpenGraph',
              data: ogData,
              format: 'rdfa',
              source: 'meta'
            });
          }
        }

        // Extract Twitter Card meta tags
        const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
        if (twitterTags.length > 0) {
          const twitterData: any = {};
          twitterTags.forEach(tag => {
            const name = tag.getAttribute('name');
            const content = tag.getAttribute('content');
            if (name && content) {
              twitterData[name] = content;
            }
          });
          
          if (Object.keys(twitterData).length > 0) {
            results.push({
              type: 'TwitterCard',
              data: twitterData,
              format: 'rdfa',
              source: 'meta'
            });
          }
        }

        // Extract microdata
        const microdataItems = document.querySelectorAll('[itemscope]');
        microdataItems.forEach((item, index) => {
          try {
            const itemType = item.getAttribute('itemtype');
            const itemData: any = {};
            
            // Extract itemprops within this scope
            const props = item.querySelectorAll('[itemprop]');
            props.forEach(prop => {
              const propName = prop.getAttribute('itemprop');
              const propValue = prop.getAttribute('content') || 
                              prop.getAttribute('datetime') ||
                              prop.textContent?.trim();
              
              if (propName && propValue) {
                itemData[propName] = propValue;
              }
            });

            if (Object.keys(itemData).length > 0) {
              results.push({
                type: itemType || 'Microdata',
                data: itemData,
                format: 'microdata',
                source: 'inline'
              });
            }
          } catch (error) {
            console.warn(`Failed to parse microdata item ${index}:`, error);
          }
        });

        return results;
      });

      logger.info(`✅ Extracted ${structuredData.length} structured data items`);
      return structuredData;

    } catch (error) {
      logger.error(`Failed to extract structured data: ${error}`);
      return [];
    }
  }

  async extractFromHtml(html: string): Promise<StructuredDataItem[]> {
    // This method could be used for static HTML analysis
    // For now, we'll focus on the Puppeteer-based extraction
    return [];
  }
}
