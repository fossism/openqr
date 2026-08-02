# OpenQR ⚡️

> A modern, open-source, privacy-first QR code design studio. Built entirely in your browser — zero tracking, zero paywalls, and real-time scan verification.

![OpenQR Studio Preview](https://raw.githubusercontent.com/fossism/openqr/main/public/favicon.svg)

---

## 🔥 Why OpenQR? (How It Stands Out)

Most web QR generators today are bloated SaaS tools that log your data through tracking servers, expire your links, or demand money just to download a high-resolution SVG or upload a logo.

**OpenQR is different:**

* 🔒 **100% Client-Side Privacy**: Everything runs in your browser using local canvas rendering. No data is sent to external servers, and your QR codes never expire.
* 🤖 **Real-Time AI Scan Verification**: Uses an integrated `jsQR` vision engine to decode your QR code live as you edit colors, shapes, or logos — ensuring 100% scannability before you print.
* 🎨 **Unrestricted Customization Studio**: Custom dot patterns, corner frames, linear/radial gradients, custom logos, and "SCAN ME" callout banners — completely free.
* 📦 **Bulk Batch Export**: Paste a CSV or multi-line list of URLs to generate dozens of labeled QR codes and download them as a structured ZIP file in seconds.
* 📄 **Multi-Format Vector Exports**: Export in high-res PNG (up to 4096px), crisp SVG vectors, WEBP, or print-ready PDF documents directly from the app.

---

## ✨ Features

- **Payload Templates**: URL, Wi-Fi (WPA/WPA2/WPA3), vCard 3.0, Email, SMS, WhatsApp, Crypto (BTC, ETH, SOL, UPI), iCal Events, and Plain Text.
- **Safety Auto-Guard**: Automatically upgrades Error Correction Level to **H (30%)** when adding center logos so your codes remain scannable.
- **Preset Theme Gallery**: Single-click styling with preset themes (*Classic Dark, Cyber Neon, Royal Gold, Emerald Mint, Sunset Glow, Minimal Mono*).
- **Offline Ready**: Works seamlessly without an active internet connection.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **QR Core**: `qr-code-styling` + `jsQR` (Real-Time Scan Engine)
- **Packaging**: `jspdf`, `jszip`, `file-saver`, `canvas-confetti`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and `npm`

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/fossism/openqr.git
cd openqr

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to check the [STANDOUT Roadmap](STANDOUT.md) for planned features or open an issue/PR.

---

## 📄 License

Released under the **MIT License**. Free for personal and commercial use.
