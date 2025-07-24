#!/bin/bash

# Git Setup Script für StructuredData Projekt
echo "🔧 Setting up Git repository..."

# Git Repository initialisieren
git init

# .env aus Tracking entfernen (falls bereits getrackt)
if [ -f .env ]; then
    echo "🔒 Removing .env from tracking..."
    git rm --cached .env 2>/dev/null || true
fi

# Alle Dateien zur Staging Area hinzufügen
echo "📁 Adding files to staging area..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: StructuredData Scraper

Features:
- CLI tool with ASCII logo
- Puppeteer web scraping
- LangChain AI integration
- Schema.org structured data
- TypeScript implementation
- Comprehensive documentation"

echo "✅ Git repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add remote repository: git remote add origin <repository-url>"
echo "2. Push to GitHub: git push -u origin main"
echo ""
echo "⚠️  Remember: .env file is excluded from Git for security"
