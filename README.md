# QR Code Generator

A simple and elegant QR code generator that creates QR codes in three different sizes from any website URL.

## Features

- Generate QR codes from website URLs
- Three size options: Small (200x200), Medium (300x300), Large (400x400)
- Download each QR code individually as PNG
- Beautiful gradient design
- Fully responsive
- 100% frontend application

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the Vite configuration
6. Click "Deploy"

## Usage

1. Enter a website URL in the input field
2. Click "Generate QR Codes" or press Enter
3. Three QR codes will appear in different sizes
4. Click the download button under any QR code to save it as PNG

## Technologies Used

- Vite
- Vanilla JavaScript
- QRCode.js library
- HTML5 Canvas
