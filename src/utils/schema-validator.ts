import * as fs from 'fs/promises';
import { logger } from './logger';

export class SchemaValidator {
  
  async validateFile(filePath: string): Promise<boolean> {
    try {
      logger.info(`📋 Validating structured data file: ${filePath}`);
      
      // Read and parse JSON file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Basic validation
      if (!data.structuredData || !Array.isArray(data.structuredData)) {
        logger.error('❌ Invalid file format: missing structuredData array');
        return false;
      }

      let isValid = true;
      let validCount = 0;

      // Validate each structured data item
      for (const [index, item] of data.structuredData.entries()) {
        const itemValid = this.validateStructuredDataItem(item, index);
        if (itemValid) {
          validCount++;
        } else {
          isValid = false;
        }
      }

      logger.info(`📊 Validation summary: ${validCount}/${data.structuredData.length} items valid`);
      
      if (isValid) {
        logger.success('✅ All structured data items are valid');
      } else {
        logger.error('❌ Some structured data items have validation errors');
      }

      return isValid;

    } catch (error) {
      logger.error(`❌ Validation failed: ${error}`);
      return false;
    }
  }

  private validateStructuredDataItem(item: any, index: number): boolean {
    try {
      // Check basic structure
      if (!item.data || typeof item.data !== 'object') {
        logger.error(`❌ Item ${index}: Missing or invalid data object`);
        return false;
      }

      // For JSON-LD, check required properties
      if (item.format === 'json-ld') {
        if (!item.data['@context']) {
          logger.error(`❌ Item ${index}: Missing @context in JSON-LD`);
          return false;
        }

        if (!item.data['@type']) {
          logger.error(`❌ Item ${index}: Missing @type in JSON-LD`);
          return false;
        }

        // Validate @context
        if (typeof item.data['@context'] === 'string') {
          if (!item.data['@context'].includes('schema.org')) {
            logger.warn(`⚠️  Item ${index}: @context should include schema.org`);
          }
        }

        // Basic schema.org type validation
        const schemaType = item.data['@type'];
        if (!this.isValidSchemaType(schemaType)) {
          logger.warn(`⚠️  Item ${index}: Unknown schema.org type: ${schemaType}`);
        }
      }

      logger.debug(`✅ Item ${index}: Valid ${item.type} (${item.format})`);
      return true;

    } catch (error) {
      logger.error(`❌ Item ${index}: Validation error - ${error}`);
      return false;
    }
  }

  private isValidSchemaType(type: string): boolean {
    // Common schema.org types
    const commonTypes = [
      'Organization', 'Person', 'WebSite', 'WebPage', 'Article', 'BlogPosting',
      'Product', 'Service', 'LocalBusiness', 'ContactPoint', 'PostalAddress',
      'Place', 'Event', 'Review', 'Rating', 'Offer', 'Brand', 'ImageObject',
      'VideoObject', 'Recipe', 'FAQ', 'Question', 'Answer', 'BreadcrumbList',
      'ListItem', 'JobPosting', 'Course', 'Book', 'Movie', 'MusicGroup',
      'Restaurant', 'Hotel', 'Store', 'NewsArticle', 'SoftwareApplication'
    ];

    return commonTypes.includes(type);
  }

  async validateStructuredData(structuredData: any[]): Promise<boolean> {
    if (!Array.isArray(structuredData)) {
      logger.error('❌ Structured data must be an array');
      return false;
    }

    let isValid = true;
    for (const [index, item] of structuredData.entries()) {
      if (!this.validateStructuredDataItem(item, index)) {
        isValid = false;
      }
    }

    return isValid;
  }
}
