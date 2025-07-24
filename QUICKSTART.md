# 🚀 Quickstart Guide

## 1. Installation
```bash
npm install
npm run build
```

## 2. Configure OpenAI API Key (optional)
```bash
# Create .env file
cp .env.example .env

# Add API key
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

## 3. First Analysis
```bash
# Test website with structured data
npm run analyze https://schema.org

# Test website without structured data
npm run analyze https://example.com

# Check results
ls output/
```

## 4. Validation
```bash
# Validate last generated file
npm run validate "./output/*.json"
```

## 5. Test All Features
```bash
# Show help (with ASCII logo)
npm run dev --help

# Force regeneration
npm run analyze https://example.com -- --force

# Custom output directory
npm run analyze https://example.com -- --output ./my-results
```

That's it! 🎉

## Important Commands Overview:
- `npm run analyze <url>` - Analyze website
- `npm run validate <file>` - Validate JSON  
- `npm run dev --help` - Show help with logo
- `npm run build` - Compile project
- `npm run watch` - Development with auto-reload
