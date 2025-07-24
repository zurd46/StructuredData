# 🚀 Schnellstart Guide

## 1. Installation
```bash
npm install
npm run build
```

## 2. OpenAI API Key konfigurieren (optional)
```bash
# .env Datei erstellen
cp .env.example .env

# API Key eintragen
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

## 3. Erste Analyse
```bash
# Website mit strukturierten Daten testen
npm run analyze https://schema.org

# Website ohne strukturierte Daten testen
npm run analyze https://example.com

# Ergebnisse anschauen
ls output/
```

## 4. Validierung
```bash
# Letzte generierte Datei validieren
npm run validate "./output/*.json"
```

## 5. Alle Features testen
```bash
# Hilfe anzeigen (mit ASCII-Logo)
npm run dev --help

# Forcierte Neugenerierung
npm run analyze https://example.com -- --force

# Custom Output-Verzeichnis
npm run analyze https://example.com -- --output ./meine-results
```

Das war's! 🎉

## Wichtige Befehle im Überblick:
- `npm run analyze <url>` - Website analysieren
- `npm run validate <file>` - JSON validieren  
- `npm run dev --help` - Hilfe mit Logo anzeigen
- `npm run build` - Projekt kompilieren
- `npm run watch` - Development mit Auto-Reload
