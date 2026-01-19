import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodesContainer = document.getElementById('qrCodesContainer');
    const downloadBtns = document.querySelectorAll('.download-btn');

    const qrSizes = {
        small: { canvas: 'qrSmall', size: 200 },
        medium: { canvas: 'qrMedium', size: 300 },
        large: { canvas: 'qrLarge', size: 400 }
    };

    generateBtn.addEventListener('click', generateQRCodes);

    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateQRCodes();
        }
    });

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            downloadQRCode(size);
        });
    });

    async function generateQRCodes() {
        let input = urlInput.value.trim();

        if (!input) {
            alert('Please enter a URL or text');
            return;
        }

        const processedInput = processInput(input);

        try {
            await Promise.all(
                Object.keys(qrSizes).map(size => {
                    const canvasId = qrSizes[size].canvas;
                    const qrSize = qrSizes[size].size;
                    return generateQR(canvasId, processedInput, qrSize);
                })
            );
        } catch (err) {
            console.error(err);
            alert('Failed to generate QR codes');
            return;
        }

        qrCodesContainer.classList.remove('hidden');
    }

    async function generateQR(canvasId, text, size) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

        await QRCode.toCanvas(canvas, text, {
            width: size,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: { dark: '#000000', light: '#ffffff' }
        });
    }

    function downloadQRCode(size) {
        if (!qrSizes[size]) return;
        const canvasId = qrSizes[size].canvas;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        canvas.toBlob(function(blob) {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `qrcode_${size}_${Date.now()}.png`;

            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    function processInput(input) {
        if (!input) return input;

        try {
            new URL(input);
            return input;
        } catch (_) {
            if (input.includes('.') && !input.includes(' ') && !input.startsWith('http://') && !input.startsWith('https://')) {
                return 'https://' + input;
            }
            return input;
        }
    }
});
