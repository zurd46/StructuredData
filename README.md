# StructuredData Scraper

Ein professionelles Node.js CLI-Tool zum Extrahieren oder Generieren von strukturierten Daten von Webseiten mit Puppeteer und LangChain.

## 🎯 Features

- 🔍 **Automatische Erkennung** vorhandener strukturierter Daten (JSON-LD, Microdata, Open Graph, Twitter Cards)
- 🤖 **KI-gestützte Generierung** neuer strukturierter Daten mit LangChain/OpenAI
- 📄 **Mehrere Formate** unterstützt (JSON-LD, Microdata, RDFa)
- ✅ **Schema.org Validierung** der generierten Daten
- 💾 **JSON Export** mit Metadaten und Zeitstempeln
- 🌐 **Web Scraping** mit Puppeteer für dynamische Inhalte
- 🎨 **Schöne CLI** mit ASCII-Logo und farbiger Ausgabe
- ⚡ **TypeScript** für maximale Typsicherheit

## 📦 Installation

```bash
# Repository klonen
git clone <repository-url>
cd StructuredData

# Dependencies installieren
npm install

# Projekt kompilieren
npm run build
```

## 🚀 Verwendung

### CLI mit ASCII-Logo
Das Tool zeigt beim Start ein schönes ASCII-Logo:

```bash
npm run dev --help
```

### Grundlegende Analyse
```bash
# Website analysieren
npm run analyze https://example.com

# Mit spezifischem Output-Verzeichnis
npm run analyze https://example.com -- --output ./meine-results

# Forcierte Neugenerierung (auch wenn strukturierte Daten vorhanden sind)
npm run analyze https://example.com -- --force
```

### Mit OpenAI API (für bessere AI-Generierung)
```bash
# API Key in .env Datei setzen
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env

# Oder als Parameter
npm run analyze https://example.com -- --openai-key "sk-your-api-key"

# Website analysieren mit KI-Unterstützung
npm run analyze https://example.com
```

### Strukturierte Daten validieren
```bash
npm run validate "./output/example_com_2025-07-24.json"
```

### Development Modus
```bash
# Development Server mit Hot Reload
npm run watch

# Direkte Ausführung
npm run dev analyze https://example.com
```

## 📊 Ausgabeformat

Die generierten JSON-Dateien enthalten:

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

## 🎯 Unterstützte Schema-Typen

- **Organization** - Unternehmen und Organisationen
- **Person** - Personen und Profile
- **WebSite** - Website-Informationen
- **Service** - Dienstleistungen
- **Product** - Produkte
- **LocalBusiness** - Lokale Unternehmen
- **Article/BlogPosting** - Artikel und Blog-Posts
- **ContactPoint** - Kontaktinformationen
- **PostalAddress** - Adressen
- **Event** - Veranstaltungen
- **Review** - Bewertungen
- **FAQ** - Häufig gestellte Fragen
- und viele weitere Schema.org Typen

## ⚙️ Konfiguration

### Umgebungsvariablen (.env)
```bash
# OpenAI API-Schlüssel für KI-gestützte Generierung
OPENAI_API_KEY=sk-your-openai-api-key

# Debug-Modus aktivieren
DEBUG=true
```

⚠️ **Wichtiger Sicherheitshinweis:** 
- Die `.env` Datei enthält sensible API-Keys
- Sie ist bereits in der `.gitignore` enthalten
- Niemals API-Keys in öffentliche Repositories committen
- Verwende `.env.example` als Vorlage für andere Entwickler

### CLI-Optionen
```bash
# Alle verfügbaren Optionen anzeigen
npm run dev analyze --help

# Optionen:
# -o, --output <path>     Output-Verzeichnis für JSON-Dateien
# -f, --force            Forcierte Neugenerierung
# --openai-key <key>     OpenAI API-Schlüssel
```

## 🔧 Entwicklung

### Projektstruktur
```
src/
├── index.ts              # CLI Entry Point mit ASCII-Logo
├── scraper.ts            # Hauptklasse für Orchestrierung
├── extractors/           # Module für Datenextraktion
│   └── structured-data-extractor.ts
├── generators/           # Module für KI-Generierung
│   └── ai-content-generator.ts
└── utils/               # Hilfsfunktionen
    ├── logger.ts        # Logging mit Emojis
    └── schema-validator.ts
```

### Verfügbare Scripts
```bash
npm run build          # TypeScript kompilieren
npm run dev            # Development-Modus
npm run start          # Produktive Ausführung
npm run watch          # Hot-Reload Development
npm run analyze        # Direkte Analyse
npm run validate       # Direkte Validierung
```

### Dependencies
- **Puppeteer** - Web Scraping und Browser-Automatisierung
- **LangChain** - KI-Integration und Content-Generierung
- **Commander.js** - CLI-Framework
- **Figlet** - ASCII-Art Text für Logo
- **Chalk** - Terminal-Farben
- **dotenv** - Umgebungsvariablen-Management

## 📝 Beispiele

### 1. Existierende strukturierte Daten extrahieren
```bash
npm run analyze https://schema.org
npm run analyze https://developers.google.com
```

### 2. Neue strukturierte Daten für Business-Website generieren
```bash
npm run analyze https://small-business.com
```

### 3. Batch-Verarbeitung mehrerer URLs
```bash
npm run analyze https://site1.com
npm run analyze https://site2.com
npm run analyze https://site3.com
```

### 4. Validierung von generierten Daten
```bash
npm run validate "./output/*.json"
```

## 🎨 Features im Detail

### ASCII-Logo
Das Tool zeigt beim Start ein ansprechendes ASCII-Logo mit farbiger Ausgabe:
- Cyan-farbiges "StructuredData" Logo
- Grüne Beschreibung
- Graue Trennlinie

### Intelligente Fallback-Logik
- Versucht zuerst OpenAI API für beste Ergebnisse
- Fällt automatisch auf Basis-Generierung zurück
- Extrahiert existierende Daten vor Neugenerierung

### Umfassende Datenextraktion
- JSON-LD Scripts
- Microdata Markup
- Open Graph Meta Tags
- Twitter Card Meta Tags
- Kontaktinformationen (E-Mail, Telefon)
- Social Media Links
- Website-Struktur (Überschriften)

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 👨‍💻 Autor

**ZurdAI** - KI-Experte für intelligente Automatisierung
- Website: [zurdai.com](https://zurdai.com)
- GitHub: [@zurd46](https://github.com/zurd46)
- LinkedIn: [zurd46](https://www.linkedin.com/in/zurd46/)

---

*Erstellt mit ❤️ und KI-Power für die Schweizer Tech-Community*
