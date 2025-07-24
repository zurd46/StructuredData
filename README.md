# StructuredData Scraper

A professional Node.js CLI tool for extracting or generating structured data from websites using Puppeteer and LangChain.

## 🎯 Features

- 🔍 **Automatic Detection** of existing structured data (JSON-LD, Microdata, Open Graph, Twitter Cards)
- 🤖 **AI-powered Generation** of new structured data with LangChain/OpenAI
- 📄 **Multiple Formats** supported (JSON-LD, Microdata, RDFa)
- ✅ **Schema.org Validation** of generated data
- 💾 **JSON Export** with metadata and timestamps
- 🌐 **Web Scraping** with Puppeteer for dynamic content
- 🎨 **Beautiful CLI** with ASCII logo and colored output
- ⚡ **TypeScript** for maximum type safety

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd StructuredData

# Install dependencies
npm install

# Build project
npm run build
```

## 🚀 Usage

### CLI with ASCII Logo
The tool displays a beautiful ASCII logo on startup:

```bash
npm run dev --help
```

### Basic Analysis
```bash
# Analyze website
npm run analyze https://example.com

# With custom output directory
npm run analyze https://example.com -- --output ./my-results

# Force regeneration (even if structured data exists)
npm run analyze https://example.com -- --force
```

### With OpenAI API (for better AI generation)
```bash
# Set API key in .env file
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env

# Or as parameter
npm run analyze https://example.com -- --openai-key "sk-your-api-key"

# Analyze website with AI support
npm run analyze https://example.com
```

### Validate Structured Data
```bash
npm run validate "./output/example_com_2025-07-24.json"
```

### Development Mode
```bash
# Development server with hot reload
npm run watch

# Direct execution
npm run dev analyze https://example.com
```

## 📊 Output Format

The generated JSON files contain:

```json
{
  "metadata": {
    "url": "https://example.com",
    "analyzedAt": "2025-07-24T10:30:00.000Z",
    "generated": false,
    "structuredDataCount": 3
  },
  "structuredData": [
    {
      "type": "Organization",
      "data": {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Example Company",
        "url": "https://example.com",
        "description": "A great company"
      },
      "format": "json-ld",
      "source": "script"
    }
  ]
}
```

## 🎯 Supported Schema Types

- **Organization** - Companies and organizations
- **Person** - People and profiles
- **WebSite** - Website information
- **Service** - Services
- **Product** - Products
- **LocalBusiness** - Local businesses
- **Article/BlogPosting** - Articles and blog posts
- **ContactPoint** - Contact information
- **PostalAddress** - Addresses
- **Event** - Events
- **Review** - Reviews
- **FAQ** - Frequently asked questions
- and many more Schema.org types

## ⚙️ Configuration

### Environment Variables (.env)
```bash
# OpenAI API key for AI-powered generation
OPENAI_API_KEY=sk-your-openai-api-key

# Enable debug mode
DEBUG=true
```

⚠️ **Important Security Note:** 
- The `.env` file contains sensitive API keys
- It's already included in `.gitignore`
- Never commit API keys to public repositories
- Use `.env.example` as a template for other developers

### CLI Options
```bash
# Show all available options
npm run dev analyze --help

# Options:
# -o, --output <path>     Output directory for JSON files
# -f, --force            Force regeneration
# --openai-key <key>     OpenAI API key
```

## 🔧 Development

### Project Structure
```
src/
├── index.ts              # CLI Entry Point with ASCII logo
├── scraper.ts            # Main orchestration class
├── extractors/           # Data extraction modules
│   └── structured-data-extractor.ts
├── generators/           # AI generation modules
│   └── ai-content-generator.ts
└── utils/               # Helper utilities
    ├── logger.ts        # Logging with emojis
    └── schema-validator.ts
```

### Available Scripts
```bash
npm run build          # Compile TypeScript
npm run dev            # Development mode
npm run start          # Production execution
npm run watch          # Hot-reload development
npm run analyze        # Direct analysis
npm run validate       # Direct validation
```

### Dependencies
- **Puppeteer** - Web scraping and browser automation
- **LangChain** - AI integration and content generation
- **Commander.js** - CLI framework
- **Figlet** - ASCII art text for logo
- **Chalk** - Terminal colors
- **dotenv** - Environment variables management

## 📝 Examples

### 1. Extract existing structured data
```bash
npm run analyze https://schema.org
npm run analyze https://developers.google.com
```

### 2. Generate new structured data for business website
```bash
npm run analyze https://small-business.com
```

### 3. Batch processing of multiple URLs
```bash
npm run analyze https://site1.com
npm run analyze https://site2.com
npm run analyze https://site3.com
```

### 4. Validate generated data
```bash
npm run validate "./output/*.json"
```

## 🎨 Features in Detail

### ASCII Logo
The tool displays an appealing ASCII logo with colored output on startup:
- Cyan-colored "StructuredData" logo
- Green description
- Gray separator line

### Intelligent Fallback Logic
- Tries OpenAI API first for best results
- Automatically falls back to basic generation
- Extracts existing data before regeneration

### Comprehensive Data Extraction
- JSON-LD Scripts
- Microdata Markup
- Open Graph Meta Tags
- Twitter Card Meta Tags
- Contact information (email, phone)
- Social media links
- Website structure (headings)

## 🤝 Contributing

1. Fork the repository
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ZurdAI** - AI Expert for Intelligent Automation
- Website: [zurdai.com](https://zurdai.com)
- GitHub: [@zurd46](https://github.com/zurd46)
- LinkedIn: [zurd46](https://www.linkedin.com/in/zurd46/)

---

*Built with ❤️ and AI-Power for the Swiss Tech Community*
