<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Structured Data Scraper Project

This is a Node.js TypeScript project that creates a CLI tool for web scraping and structured data analysis.

## Project Context
- **Primary Language**: TypeScript/Node.js
- **Main Dependencies**: Puppeteer for web scraping, LangChain for AI content generation
- **Purpose**: Extract existing structured data from websites or generate new structured data using AI
- **Target Schema**: Schema.org JSON-LD format

## Code Style Guidelines
- Use TypeScript with strict type checking
- Follow async/await patterns for asynchronous operations
- Use proper error handling with try-catch blocks
- Include comprehensive logging using the custom logger utility
- Maintain clean separation of concerns between modules

## Key Components
- **Scraper**: Main orchestration class that handles the analysis workflow
- **Extractors**: Classes for extracting existing structured data from web pages
- **Generators**: AI-powered classes for generating new structured data
- **Utils**: Helper utilities for logging, validation, and file operations

## Development Notes
- The CLI uses Commander.js for command-line interface
- Puppeteer is configured to run in headless mode by default
- OpenAI API integration is optional - app falls back to basic generation
- All structured data follows Schema.org standards
- Output files are saved in JSON format with metadata
