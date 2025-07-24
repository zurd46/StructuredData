# Git Setup Script für StructuredData Projekt (PowerShell)
Write-Host "🔧 Setting up Git repository..." -ForegroundColor Cyan

# Git Repository initialisieren
git init

# .env aus Tracking entfernen (falls bereits getrackt)
if (Test-Path .env) {
    Write-Host "🔒 Removing .env from tracking..." -ForegroundColor Yellow
    git rm --cached .env 2>$null
}

# Alle Dateien zur Staging Area hinzufügen
Write-Host "📁 Adding files to staging area..." -ForegroundColor Green
git add .

# Initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit: StructuredData Scraper

Features:
- CLI tool with ASCII logo
- Puppeteer web scraping
- LangChain AI integration
- Schema.org structured data
- TypeScript implementation
- Comprehensive documentation"

Write-Host "✅ Git repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Add remote repository: git remote add origin <repository-url>"
Write-Host "2. Push to GitHub: git push -u origin main"
Write-Host ""
Write-Host "⚠️  Remember: .env file is excluded from Git for security" -ForegroundColor Yellow
