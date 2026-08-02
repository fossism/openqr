# OpenQR

OpenQR is a modern, open-source, client-side QR code generator built for customizability, reliability, and privacy. Unlike traditional web-based QR generators that route your data through backend tracking servers or lock standard customization options behind paid accounts, OpenQR runs entirely inside your browser. No data is sent to external servers, no account registration is required, and all features are freely accessible.

OpenQR includes an inline computer vision verification engine powered by jsQR that continuously decodes the generated QR canvas in real time. This guarantees that your visual customizations, color gradients, and logo overlays remain scannable before you print or distribute them.

---

## Features

- 100 Percent Client-Side Execution: All generation, styling, and scanning verification occur strictly in the browser. Zero analytics, zero backend requests, and complete offline capability.
- Real-Time Scan Verification Engine: Uses jsQR to decode the rendered canvas dynamically as you edit. Provides instant visual feedback on scannability and contrast safety.
- Full Customization Studio:
  - Custom module dot patterns (Square, Dots, Rounded, Extra Rounded, Classy, Classy Smooth).
  - Custom corner frame and inner eye shape selectors.
  - Solid colors, linear gradients with custom rotation angles, and radial gradients.
  - Transparent background support for PNG and SVG output.
- Logo Integration and Safety Protection:
  - Upload custom PNG, SVG, WEBP, or JPG logos.
  - Choose from built-in brand preset icons (Wi-Fi, Website, WhatsApp, GitHub, Bitcoin, Email).
  - Automatically upgrades Error Correction Level (ECC Level H - 30 percent recovery capacity) when a logo is added to preserve scannability.
- Call-to-Action Frame Banners: Add customizable top or bottom callout banners (for example, "SCAN ME", "CONNECT WIFI", "PAY HERE") with configurable text, background, and border styling.
- Curated Aesthetic Themes: Quick preset theme gallery (Classic Dark, Cyber Neon, Royal Gold, Emerald Mint, Sunset Glow, Minimal Mono) to style QR codes in one click.
- Multi-Format Exports:
  - High-resolution PNG and WEBP exports up to 4096 x 4096 pixels.
  - Scalable vector SVG format for professional graphic design and printing.
  - Print-ready PDF documents generated directly in the browser.
- Bulk Batch Generation:
  - Input multi-line URLs or CSV data.
  - Generate multiple labeled QR codes concurrently.
  - Export all generated files into a single structured ZIP archive.

---

## Supported Content Types

OpenQR supports formatted payloads for nine common use cases:

1. Website URL: Direct links with optional standard suggestions.
2. Wi-Fi Network: Standard Wi-Fi connection strings (WPA/WPA2/WPA3, WEP, Open) with support for hidden network SSIDs.
3. vCard 3.0: Contact cards containing first and last names, organization, job title, phone numbers, email address, website, and location details.
4. Email: Pre-filled mailto links with recipient, subject line, and body text.
5. SMS: Direct text message triggers with target phone numbers and preset messages.
6. WhatsApp: Instant chat links formatted for direct messaging with custom text.
7. Crypto and Digital Payments: Bitcoin, Ethereum, Solana, and UPI payment strings with optional amount fields.
8. Event (iCal): VEVENT standard calendar invites specifying title, start/end dates, location, and description.
9. Plain Text: Raw text payloads without predefined structural formatting.

---

## Technology Stack

- Core Framework: React 19, TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS v4, Lucide React Icons
- QR Rendering Engine: qr-code-styling
- Real-time Verification: jsQR
- Export and Packaging Libraries: jspdf, jszip, file-saver, canvas-confetti

---

## Getting Started

### Prerequisites

Ensure you have Node.js (version 18 or higher) and npm installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/openqr.git
   cd openqr
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

### Development Server

To run the application locally in development mode:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

To compile the TypeScript project and generate optimized static assets for deployment:

```bash
npm run build
```

The production assets will be built inside the `dist` directory. You can preview the production build locally with:

```bash
npm run preview
```

---

## Project Structure

```
openqr/
├── public/
│   └── favicon.svg           # Application SVG favicon
├── src/
│   ├── components/
│   │   ├── contentForms/     # Dedicated input forms for payload types
│   │   │   ├── CryptoForm.tsx
│   │   │   ├── EmailSmsForm.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── UrlForm.tsx
│   │   │   ├── VCardForm.tsx
│   │   │   ├── WhatsappForm.tsx
│   │   │   └── WifiForm.tsx
│   │   ├── customization/   # Design configuration modules
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── ExportPanel.tsx
│   │   │   ├── FramePicker.tsx
│   │   │   ├── LogoUploader.tsx
│   │   │   └── StylePicker.tsx
│   │   ├── BatchGenerator.tsx # Bulk generation & ZIP export modal
│   │   ├── Header.tsx         # Navigation & top actions header
│   │   ├── PresetTemplates.tsx# Theme preset modal
│   │   ├── QRPreview.tsx      # Live canvas preview & composite renderer
│   │   └── ScannabilityIndicator.tsx # Real-time verification feedback component
│   ├── types/
│   │   └── qr.ts              # TypeScript interfaces & configuration types
│   ├── utils/
│   │   ├── exportUtils.ts     # PNG, SVG, WEBP, and PDF export logic
│   │   ├── formatters.ts      # Payload formatting utilities (vCard, Wi-Fi, etc.)
│   │   ├── presets.ts         # Theme presets and SVG brand icon definitions
│   │   ├── qrGenerator.ts     # QR styling options builder & frame canvas compositor
│   │   └── qrScanner.ts       # jsQR client-side verification engine
│   ├── App.tsx                # Main app layout and state orchestration
│   ├── index.css              # Custom styling & Tailwind directives
│   └── main.tsx               # React application entry point
├── index.html                 # Main HTML document template
├── package.json               # Project dependencies and script scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build configuration
```

---

## Privacy Assurance

OpenQR prioritizes user privacy. Traditional online QR code generators often use dynamic redirects that log your visitors' IP addresses, device types, and location data through intermediary servers. 

OpenQR generates static QR codes directly in your client browser. Your data never touches a remote server, ensuring:
- Absolute data confidentiality (ideal for sensitive Wi-Fi credentials, business contacts, and private notes).
- Zero subscription paywalls or hidden fees for high-resolution exports.
- Infinite longevity: because static QR codes contain the target data directly, your QR codes will never expire or break due to server shutdowns.

---

## License

This project is open-source and released under the MIT License. Feel free to fork, modify, and distribute it for personal or commercial use.
