# QR Code Generator API

Generate QR codes from text, URLs, and data. Customize size, format, and error correction level.

## Quick Start

### Browser
```html
<script src="qrCodeGenerator.js"></script>

<script>
  // Generate a QR code
  const qrUrl = await qrCodeAPI.generateQRCode('https://github.com');
  const img = document.createElement('img');
  img.src = qrUrl;
  document.body.appendChild(img);
</script>
```

### Node.js
```javascript
const { generateQRCode } = require('./qrCodeGenerator.js');

// Generate QR code URL
const qrUrl = await generateQRCode('Hello World');
console.log(qrUrl);
```

## API Functions

| Function | Description |
|----------|-------------|
| `generateQRCode(data, options)` | Generate QR code URL |
| `generateQRCodeBase64(data, options)` | Generate QR code with base64 encoding |
| `generateMultipleQRCodes(array, options)` | Generate multiple QR codes |
| `getQRCodeOptions()` | Get available configuration options |

## Options

- **size**: 50-1000 (default: 200)
- **format**: 'png', 'jpg', 'svg', 'eps', 'pdf' (default: 'png')
- **errorCorrection**: 'L', 'M', 'Q', 'H' (default: 'M')
- **margin**: Quiet zone margin (default: 0)

## Examples

### Basic QR Code
```javascript
const url = await qrCodeAPI.generateQRCode('https://example.com');
```

### Large QR Code with High Error Correction
```javascript
const url = await qrCodeAPI.generateQRCode('Important Data', {
  size: 500,
  errorCorrection: 'H',
  format: 'png'
});
```

## License

MIT
