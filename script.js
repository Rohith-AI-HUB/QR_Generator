import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', () => {
    const contentInput = document.getElementById('contentInput');
    const characterCount = document.getElementById('characterCount');
    const fieldMessage = document.getElementById('fieldMessage');
    const previewFrame = document.getElementById('previewFrame');
    const qrCanvas = document.getElementById('qrCanvas');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const statusStrip = document.getElementById('statusStrip');
    const statusText = document.getElementById('statusText');
    const sizeInputs = document.querySelectorAll('input[name="qrSize"]');

    const maxLength = Number(contentInput.getAttribute('maxlength')) || 2000;
    let debounceTimer;
    let processedContent = '';
    let selectedSize = getSelectedSize();

    contentInput.addEventListener('input', () => {
        updateCharacterCount();
        queuePreview();
    });

    sizeInputs.forEach((input) => {
        input.addEventListener('change', () => {
            selectedSize = getSelectedSize();
            queuePreview(0);
        });
    });

    downloadBtn.addEventListener('click', downloadQRCode);
    copyBtn.addEventListener('click', copyContent);

    updateCharacterCount();
    setEmptyState();

    function queuePreview(delay = 250) {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(generatePreview, delay);
    }

    async function generatePreview() {
        const rawContent = contentInput.value.trim();

        if (!rawContent) {
            setEmptyState();
            return;
        }

        if (rawContent.length > maxLength) {
            setErrorState('Content is too long.');
            return;
        }

        processedContent = processInput(rawContent);

        try {
            await QRCode.toCanvas(qrCanvas, processedContent, {
                width: selectedSize,
                margin: 2,
                errorCorrectionLevel: 'M',
                color: {
                    dark: '#111111',
                    light: '#ffffff'
                }
            });

            previewFrame.classList.add('has-qr');
            contentInput.setAttribute('aria-invalid', 'false');
            downloadBtn.disabled = false;
            copyBtn.disabled = false;
            fieldMessage.textContent = processedContent === rawContent
                ? 'Preview generated from entered content.'
                : `Preview generated from ${processedContent}.`;
            fieldMessage.className = 'field-message success';
            setStatus('Ready to generate');
        } catch (error) {
            console.error(error);
            setErrorState('Could not generate a QR code for this content.');
        }
    }

    function setEmptyState() {
        processedContent = '';
        previewFrame.classList.remove('has-qr');
        clearCanvas();
        contentInput.setAttribute('aria-invalid', 'false');
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
        fieldMessage.textContent = 'Enter content to generate a preview.';
        fieldMessage.className = 'field-message';
        setStatus('Ready to generate');
    }

    function setErrorState(message) {
        processedContent = '';
        previewFrame.classList.remove('has-qr');
        clearCanvas();
        contentInput.setAttribute('aria-invalid', 'true');
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
        fieldMessage.textContent = message;
        fieldMessage.className = 'field-message error';
        setStatus(message, true);
    }

    function setStatus(message, isError = false) {
        statusText.textContent = message;
        statusStrip.classList.toggle('error', isError);
    }

    function updateCharacterCount() {
        characterCount.textContent = `${contentInput.value.length} / ${maxLength}`;
    }

    function getSelectedSize() {
        const checkedInput = document.querySelector('input[name="qrSize"]:checked');
        return Number(checkedInput?.value || 300);
    }

    function clearCanvas() {
        const ctx = qrCanvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    }

    function downloadQRCode() {
        if (!processedContent) return;

        qrCanvas.toBlob((blob) => {
            if (!blob) {
                setStatus('Download failed.', true);
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode_${selectedSize}px_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setStatus('PNG download started.');
        }, 'image/png');
    }

    async function copyContent() {
        if (!processedContent) return;

        try {
            await navigator.clipboard.writeText(processedContent);
            setStatus('Content copied.');
        } catch (error) {
            console.error(error);
            setStatus('Copy failed.', true);
        }
    }

    function processInput(input) {
        if (!input) return input;

        try {
            new URL(input);
            return input;
        } catch (_) {
            const looksLikeDomain = input.includes('.')
                && !input.includes(' ')
                && !input.startsWith('http://')
                && !input.startsWith('https://');

            return looksLikeDomain ? `https://${input}` : input;
        }
    }
});
