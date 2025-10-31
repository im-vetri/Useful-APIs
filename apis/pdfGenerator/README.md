# PDF Generator API

Convert HTML/text to PDF and generate invoices, reports, certificates. Supports simple templating, styling, and works in Node.js (Puppeteer) or in-browser (html2pdf / jsPDF) when available.

## Quick Start

### Browser
```html
<script src="pdfGenerator.js"></script>

<script>
  // Convert HTML string to a PDF Blob (requires html2pdf or jsPDF on the page)
  PDFGeneratorAPI.convertHtmlToPdf('<h1>Hello</h1><p>World</p>')
    .then(blob => {
      // download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(err => console.error(err));
</script>
```

### Node.js
```javascript
const PDFGeneratorAPI = require('./pdfGenerator.js');
const fs = require('fs');

(async () => {
  // Convert HTML to PDF (returns a Buffer in Node)
  const buffer = await PDFGeneratorAPI.convertHtmlToPdf('<h1>Report</h1><p>Generated</p>');
  fs.writeFileSync('report.pdf', buffer);

  // Generate invoice using structured data
  const invoicePdf = await PDFGeneratorAPI.generateInvoice({
    invoiceNumber: 'INV-001',
    date: '2025-10-31',
    billTo: { name: 'Acme Corp', address: '1 Main St' },
    items: [{ desc: 'Service', qty: 2, unitPrice: 100 }],
    currency: 'USD',
    notes: 'Thanks for your business.'
  });
  fs.writeFileSync('invoice.pdf', invoicePdf);
})();
```

## API Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `convertHtmlToPdf(htmlOrTemplate, data, options)` | `htmlOrTemplate` (string), `data` (optional object), `options` | Convert HTML or template to PDF. Returns Buffer (Node) or Blob (browser). |
| `generateInvoice(invoiceData, template?, options?)` | `invoiceData` (object), `template` (optional HTML) | Generate invoice PDF from structured data. |
| `generateReport(reportData, template?, options?)` | `reportData` (object) | Generate a report PDF using a template. |
| `generateCertificate(data, template?, options?)` | `data` (object) | Generate a certificate PDF. |
| `renderFromTemplate(template, data)` | `template` (string), `data` (object) | Simple safe replacement of {{key}} placeholders. |
| `listTemplates()` | None | Returns available builtin templates. |
| `formatCurrency(value, currency)` | `value`, `currency` | Format number as currency string (Intl-based). |

## Response Format

- Node.js: functions that produce PDFs return a Buffer.
- Browser: functions return a Blob (PDF).
- Example convertHtmlToPdf result (Node):
```json
<Buffer ...> // write to file with fs.writeFileSync('out.pdf', buffer)
```

## Error Handling

All functions return rejected promises on error with descriptive messages.

```javascript
PDFGeneratorAPI.convertHtmlToPdf(null)
  .catch(err => console.error('Error:', err.message));
```

## Examples

### Basic HTML -> PDF
```javascript
const pdf = await PDFGeneratorAPI.convertHtmlToPdf('<h1>Title</h1><p>Body</p>');
// Node: save Buffer, Browser: download Blob
```

### Invoice (default template)
```javascript
const invoicePdf = await PDFGeneratorAPI.generateInvoice({
  invoiceNumber: 'INV-2025-001',
  date: '2025-10-31',
  billTo: { name: 'Client', address: '123 Road' },
  items: [{ desc: 'Design', qty: 1, unitPrice: 500 }],
  currency: 'USD',
  notes: 'Payment due in 30 days'
});
```

### Custom template
```javascript
const tpl = '<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>';
const pdf = await PDFGeneratorAPI.convertHtmlToPdf(tpl, { title: 'My', content: 'Custom' });
```

## Notes & Requirements

- Node.js: Puppeteer is recommended (npm i puppeteer). Module will throw a clear error if Puppeteer is not installed.
- Browser: include a client-side library (html2pdf or jsPDF) if you need client PDF generation.
- Templates use simple placeholder replacement only (no code execution) — safe for untrusted data.
- Options let you override paper format, margins, landscape, and Puppeteer launch options.

## License

MIT
```// filepath: /Users/mananbansal/Desktop/Cloning Thing/Useful-APIs/apis/pdfGenerator/README.md
# PDF Generator API

Convert HTML/text to PDF and generate invoices, reports, certificates. Supports simple templating, styling, and works in Node.js (Puppeteer) or in-browser (html2pdf / jsPDF) when available.

## Quick Start

### Browser
```html
<script src="pdfGenerator.js"></script>

<script>
  // Convert HTML string to a PDF Blob (requires html2pdf or jsPDF on the page)
  PDFGeneratorAPI.convertHtmlToPdf('<h1>Hello</h1><p>World</p>')
    .then(blob => {
      // download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(err => console.error(err));
</script>
```

### Node.js
```javascript
const PDFGeneratorAPI = require('./pdfGenerator.js');
const fs = require('fs');

(async () => {
  // Convert HTML to PDF (returns a Buffer in Node)
  const buffer = await PDFGeneratorAPI.convertHtmlToPdf('<h1>Report</h1><p>Generated</p>');
  fs.writeFileSync('report.pdf', buffer);

  // Generate invoice using structured data
  const invoicePdf = await PDFGeneratorAPI.generateInvoice({
    invoiceNumber: 'INV-001',
    date: '2025-10-31',
    billTo: { name: 'Acme Corp', address: '1 Main St' },
    items: [{ desc: 'Service', qty: 2, unitPrice: 100 }],
    currency: 'USD',
    notes: 'Thanks for your business.'
  });
  fs.writeFileSync('invoice.pdf', invoicePdf);
})();
```

## API Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `convertHtmlToPdf(htmlOrTemplate, data, options)` | `htmlOrTemplate` (string), `data` (optional object), `options` | Convert HTML or template to PDF. Returns Buffer (Node) or Blob (browser). |
| `generateInvoice(invoiceData, template?, options?)` | `invoiceData` (object), `template` (optional HTML) | Generate invoice PDF from structured data. |
| `generateReport(reportData, template?, options?)` | `reportData` (object) | Generate a report PDF using a template. |
| `generateCertificate(data, template?, options?)` | `data` (object) | Generate a certificate PDF. |
| `renderFromTemplate(template, data)` | `template` (string), `data` (object) | Simple safe replacement of {{key}} placeholders. |
| `listTemplates()` | None | Returns available builtin templates. |
| `formatCurrency(value, currency)` | `value`, `currency` | Format number as currency string (Intl-based). |

## Response Format

- Node.js: functions that produce PDFs return a Buffer.
- Browser: functions return a Blob (PDF).
- Example convertHtmlToPdf result (Node):
```json
<Buffer ...> // write to file with fs.writeFileSync('out.pdf', buffer)
```

## Error Handling

All functions return rejected promises on error with descriptive messages.

```javascript
PDFGeneratorAPI.convertHtmlToPdf(null)
  .catch(err => console.error('Error:', err.message));
```

## Examples

### Basic HTML -> PDF
```javascript
const pdf = await PDFGeneratorAPI.convertHtmlToPdf('<h1>Title</h1><p>Body</p>');
// Node: save Buffer, Browser: download Blob
```

### Invoice (default template)
```javascript
const invoicePdf = await PDFGeneratorAPI.generateInvoice({
  invoiceNumber: 'INV-2025-001',
  date: '2025-10-31',
  billTo: { name: 'Client', address: '123 Road' },
  items: [{ desc: 'Design', qty: 1, unitPrice: 500 }],
  currency: 'USD',
  notes: 'Payment due in 30 days'
});
```

### Custom template
```javascript
const tpl = '<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>';
const pdf = await PDFGeneratorAPI.convertHtmlToPdf(tpl, { title: 'My', content: 'Custom' });
```

## Notes & Requirements

- Node.js: Puppeteer is recommended (npm i puppeteer). Module will throw a clear error if Puppeteer is not installed.
- Browser: include a client-side library (html2pdf or jsPDF) if you need client PDF generation.
- Templates use simple placeholder replacement only (no code execution) — safe for untrusted data.
- Options let you override paper format, margins, landscape, and Puppeteer launch options.

## License

MIT