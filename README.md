# OpenQR

OpenQR is a privacy-first, open-source QR code generator that runs completely inside your browser. No account required, no tracking servers, no paywalls for high-resolution exports, and your QR codes never expire.

## Why OpenQR?

Most online QR code generators route your data through backend tracking servers or force you to pay for standard features like SVG downloads or logo uploads.

OpenQR is built differently:
- **100% Client-Side**: All rendering happens locally in your browser. No data is sent to external servers, and it works offline.
- **Real-Time Scan Verification**: Checks if your QR code is scannable as you edit colors, shapes, and logos, preventing misprints.
- **Full Customization**: Customize module dot shapes, corner frames, linear/radial gradients, center logos, and callout text ("SCAN ME").
- **Bulk Batch Export**: Paste a multi-line list or CSV of links to generate multiple labeled QR codes and download them as a ZIP file.
- **Vector & Print Formats**: Export high-resolution PNG (up to 4096px), scalable SVG vectors, WEBP, or printable PDF documents.

## Supported Content Types

- Website URLs
- Wi-Fi Networks (WPA/WPA2/WPA3, WEP, Open)
- vCard 3.0 Contact Cards
- Email & SMS Messages
- WhatsApp Direct Chat
- Crypto Payments (BTC, ETH, SOL, UPI)
- iCal Calendar Events
- Plain Text

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS, Lucide Icons
- qr-code-styling, jsQR
- jspdf, jszip, file-saver

## Getting Started

### Prerequisites

- Node.js (v18 or higher) and npm

### Installation & Local Run

```bash
git clone https://github.com/fossism/openqr.git
cd openqr
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## License

Released under the MIT License. Free for personal and commercial use.
