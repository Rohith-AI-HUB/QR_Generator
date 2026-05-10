# QR Code Generator

A polished frontend-only QR code generator built with Vite, vanilla JavaScript, and the `qrcode` package.

## Features

- Live QR preview from any URL or text
- Domain normalization for entries like `example.com`
- Output size selector: 200px, 300px, and 400px
- PNG download from the generated canvas
- Copy the processed QR content to the clipboard
- Inline empty, success, and error states
- Responsive two-column workbench layout

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

1. Paste a URL or text into the content field.
2. Choose an output size.
3. Review the live QR preview.
4. Download the QR as a PNG or copy the processed content.

## Technologies Used

- Vite
- Vanilla JavaScript
- HTML5 Canvas
- QRCode.js library
