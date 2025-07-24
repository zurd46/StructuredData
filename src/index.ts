#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { StructuredDataScraper } from './scraper';
import { logger } from './utils/logger';

// Display ASCII logo
function displayLogo() {
  console.log('\n');
  console.log(chalk.cyan(figlet.textSync('StructuredData', {
    font: 'Small',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })));
  console.log(chalk.green('🔍 Web Scraping & AI-powered Structured Data Generation'));
  console.log(chalk.gray('───────────────────────────────────────────────────────\n'));
}

// Display logo at startup
displayLogo();

const program = new Command();

program
  .name('structured-data-scraper')
  .description('CLI tool to extract or generate structured data from websites')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze a website for structured data')
  .argument('<url>', 'Website URL to analyze')
  .option('-o, --output <path>', 'Output directory for JSON files', './output')
  .option('-f, --force', 'Force generation even if structured data exists', false)
  .option('--openai-key <key>', 'OpenAI API key for content generation')
  .action(async (url: string, options) => {
    try {
      logger.info(`🔍 Analyzing website: ${url}`);
      
      const scraper = new StructuredDataScraper({
        outputDir: options.output,
        force: options.force,
        openaiApiKey: options.openaiKey || process.env.OPENAI_API_KEY
      });

      const result = await scraper.analyze(url);
      
      if (result.success) {
        logger.info(`✅ Analysis completed! Files saved to: ${result.outputPath}`);
        logger.info(`📊 Found ${result.structuredDataCount} structured data entries`);
        if (result.generated) {
          logger.info(`🤖 Generated new structured data using AI`);
        }
      } else {
        logger.error(`❌ Analysis failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      logger.error(`💥 Unexpected error: ${error}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate structured data from a JSON file')
  .argument('<file>', 'JSON file to validate')
  .action(async (file: string) => {
    try {
      const scraper = new StructuredDataScraper();
      const isValid = await scraper.validateStructuredData(file);
      
      if (isValid) {
        logger.info(`✅ Structured data is valid`);
      } else {
        logger.error(`❌ Structured data validation failed`);
        process.exit(1);
      }
    } catch (error) {
      logger.error(`💥 Validation error: ${error}`);
      process.exit(1);
    }
  });

program.parse();
