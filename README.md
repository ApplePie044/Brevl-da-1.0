# Postkoll — Mail Delivery Tracker

En webbapplikation för att spåra när post brukar komma och logga brevlådeöppningar.

## Funktioner

- **Daglig schema**: Välj dag och se förväntade posttider
- **Visualisering**: Interaktiv meter som visar sannolikhet för postleverans per timme
- **Brevlådelogg**: Spåra när brevlådan öppnas och stängs med varaktighet
- **Användarkonton**: Skapa konto och få e-postnotifikationer
- **Responsiv design**: Fungerar på desktop och mobil

## Installation

1. Öppna `index.html` i en webbläsare
2. Ingen server eller installation krävs - allt körs lokalt

## Projektstruktur

```
Mailbox Website/
├── index.html              # Huvudsida
├── README.md              # Dokumentation
├── css/                   # CSS-filer (separerade)
│   ├── base.css          # Grundstilsökningar och variabler
│   ├── header.css        # Header-styling
│   ├── buttons.css       # Knappstilsökningar
│   ├── schedule.css      # Schemasektionen
│   ├── meter.css         # Metervisualisering
│   ├── openings.css      # Öppningslogg
│   ├── modal.css         # Modal-styling
│   └── responsive.css    # Responsiv design
└── js/                    # JavaScript-moduler
    ├── schedule.js        # Schema-data och dagfunktioner
    ├── auth.js           # Användarhantering och e-post
    ├── meter.js          # Metervisualisering
    ├── openings.js       # Brevlådelogg-logik
    ├── renderer.js       # Rendering av tider
    ├── modals.js         # Modal-hantering
    └── app.js            # Huvudapplikation

```

## Redigera schema

Ändra posttider i `js/schedule.js`:

```javascript
const schedule = {
  "måndag": ["08:30","15:00"],
  "tisdag": ["08:30","15:00"],
  // ...
};
```

## E-postnotifikationer

E-postfunktionaliteten är för närvarande en demo. I produktion skulle detta kräva:
- Backend API (Node.js, PHP, etc.)
- E-posttjänst (SendGrid, Mailgun, SMTP)
- Säker användarautentisering

## Lokal lagring

Använder `localStorage` för:
- Brevlådeöppningar (`mailbox_openings`)
- Användarkonto (`postkoll_account`)

## Teknologi

- HTML5
- CSS3 (Custom Properties, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API
