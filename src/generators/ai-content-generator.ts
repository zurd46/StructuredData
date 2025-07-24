import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { logger } from '../utils/logger';
import { StructuredDataItem } from '../extractors/structured-data-extractor';

export interface PageContent {
  title: string;
  description: string;
  keywords: string;
  content: string;
  emails: string[];
  phones: string[];
  socialLinks: string[];
  headings: Array<{ tag: string; text: string }>;
  url: string;
}

export class AIContentGenerator {
  private llm?: ChatOpenAI;

  constructor(private apiKey: string) {
    if (apiKey) {
      this.llm = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: 'gpt-4o-mini',
        temperature: 0.1
      });
    }
  }

  async generateStructuredData(url: string, pageContent: PageContent): Promise<StructuredDataItem[]> {
    if (!this.llm) {
      logger.warn('No OpenAI API key provided, generating basic structured data...');
      return this.generateBasicStructuredData(url, pageContent);
    }

    try {
      logger.info('🤖 Generating structured data with AI...');
      
      const prompt = PromptTemplate.fromTemplate(`
Du bist ein Experte für strukturierte Daten und Schema.org. Analysiere die folgenden Website-Informationen und erstelle entsprechende JSON-LD strukturierte Daten.

Website URL: {url}
Titel: {title}
Beschreibung: {description}
Keywords: {keywords}
Hauptinhalt: {content}
E-Mails: {emails}
Telefonnummern: {phones}
Social Media Links: {socialLinks}
Überschriften: {headings}

Erstelle JSON-LD strukturierte Daten basierend auf dem Inhalt. Berücksichtige diese Schema.org Typen:
- Organization (falls es ein Unternehmen ist)
- Person (falls es eine Personenseite ist)
- WebSite 
- Service (falls Dienstleistungen angeboten werden)
- Product (falls Produkte verkauft werden)
- LocalBusiness (falls es ein lokales Unternehmen ist)
- Article (falls es ein Artikel/Blog ist)

Gib NUR gültiges JSON zurück in diesem Format:
[
  {{
    "@context": "https://schema.org",
    "@type": "...",
    ...
  }}
]

Stelle sicher, dass alle Daten korrekt und vollständig sind. Nutze die vorhandenen Informationen optimal.
`);

      const formattedPrompt = await prompt.format({
        url,
        title: pageContent.title,
        description: pageContent.description,
        keywords: pageContent.keywords,
        content: pageContent.content.substring(0, 2000), // Limit for token usage
        emails: pageContent.emails.join(', '),
        phones: pageContent.phones.join(', '),
        socialLinks: pageContent.socialLinks.join(', '),
        headings: pageContent.headings.map(h => `${h.tag}: ${h.text}`).join(', ')
      });

      const response = await this.llm.invoke(formattedPrompt);
      const responseText = response.content.toString();
      
      // Parse JSON response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in AI response');
      }

      const structuredDataArray = JSON.parse(jsonMatch[0]);
      
      // Convert to StructuredDataItem format
      const results: StructuredDataItem[] = structuredDataArray.map((data: any) => ({
        type: data['@type'] || 'Generated',
        data: data,
        format: 'json-ld' as const,
        source: 'script' as const
      }));

      logger.info(`✅ Generated ${results.length} structured data items with AI`);
      return results;

    } catch (error) {
      logger.error(`❌ AI generation failed: ${error}`);
      logger.info('🔄 Falling back to basic generation...');
      return this.generateBasicStructuredData(url, pageContent);
    }
  }

  private generateBasicStructuredData(url: string, pageContent: PageContent): StructuredDataItem[] {
    const results: StructuredDataItem[] = [];

    // Generate basic WebSite schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": pageContent.title,
      "url": url,
      "description": pageContent.description || pageContent.title,
      "keywords": pageContent.keywords
    };

    results.push({
      type: 'WebSite',
      data: websiteSchema,
      format: 'json-ld',
      source: 'script'
    });

    // Try to detect if it's an organization
    const hasBusinessInfo = pageContent.emails.length > 0 || 
                           pageContent.phones.length > 0 || 
                           pageContent.socialLinks.length > 0;

    if (hasBusinessInfo) {
      const organizationSchema: any = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": pageContent.title,
        "url": url,
        "description": pageContent.description || pageContent.title
      };

      if (pageContent.emails.length > 0) {
        organizationSchema.email = pageContent.emails[0];
      }

      if (pageContent.phones.length > 0) {
        organizationSchema.telephone = pageContent.phones[0];
      }

      if (pageContent.socialLinks.length > 0) {
        organizationSchema.sameAs = pageContent.socialLinks;
      }

      results.push({
        type: 'Organization',
        data: organizationSchema,
        format: 'json-ld',
        source: 'script'
      });
    }

    logger.info(`✅ Generated ${results.length} basic structured data items`);
    return results;
  }
}
