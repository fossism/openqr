# OpenQR

A free QR code maker that runs fully in your browser. No account, no tracking, no paywalls. Your QR codes never expire.

Try it here: https://fossism.github.io/openqr/

## What you can make

Pick what goes inside the code, then style it how you like:

- Website links
- Wi-Fi logins (WPA/WPA2/WPA3, WEP, open networks)
- Contact cards (vCard)
- Email and SMS drafts
- WhatsApp chat links
- Crypto and UPI payment requests (BTC, ETH, SOL, UPI)
- Calendar events
- Plain text

## Styling

- Square or rounded dot patterns, corner frames, and inner eyes
- Solid colors or gradients
- Your own logo in the center, with optional backing shape
- Frames with call-to-action text like SCAN ME, including a ticket-stub style
- Five built-in themes: Classic Ink, Brand Teal, Terracotta, FOSS Terminal, Sharp Ink

## Before you print

OpenQR scans your code live as you edit it. If a color combo, logo size, or long text makes it hard to read, it tells you straight away, so you never print a dead code. It also warns you about low contrast and oversized payloads.

## Export

- PNG from 512 up to 4096 px
- SVG vector, WebP, and print-ready PDF
- Copy the image straight to your clipboard
- Save and reload your design as a theme file
- Copy a share link that restores your design and content
- Batch mode: paste a list of links, get back a ZIP of labeled QR codes

Everything is generated on your device. Nothing you type is uploaded anywhere, and the app works offline once loaded.

## Run it locally

You need Node.js 18 or newer.

```bash
git clone https://github.com/fossism/openqr.git
cd openqr
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

Other commands:

```bash
npm run build   # type-check and build for production
npm run lint    # lint the codebase
npm run preview # preview the production build
```

## Deploy it yourself

Pushing to `main` deploys to GitHub Pages automatically (see `.github/workflows/deploy.yml`). For a project page it builds with the `/openqr/` base path; for hosts that serve from the domain root (like Cloudflare Pages), a plain `npm run build` just works.

Cloudflare Pages settings that work: framework preset Vite, build command `npm run build`, output directory `dist`.

## Built with

React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, qr-code-styling, jsQR, jspdf, jszip, file-saver.

## License

Released under the MIT License. Free for personal and commercial use.
