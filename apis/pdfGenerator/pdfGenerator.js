/**
 * PDF Generator API
 * Convert HTML/text to PDF, generate invoices, reports, certificates.
 * Supports simple templating and uses Puppeteer (Node) or browser libs when available.
 *
 * @author Useful-APIs Contributors
 * @version 1.0.0
 *
 * Notes:
 * - Node: installs recommended: puppeteer (npm i puppeteer). If not present an error will be thrown.
 * - Browser: will attempt to use window.html2pdf or window.jspdf if available, otherwise will throw.
 */

const DEFAULT_OPTIONS = {
    format: "A4",
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    printBackground: true,
    preferCSSPageSize: true,
    landscape: false,
};

async function _requirePuppeteer() {
    // lazy require to avoid breaking browser usage
    try {
        // eslint-disable-next-line global-require
        return require("puppeteer");
    } catch (err) {
        throw new Error(
            "Puppeteer is not installed. In Node.js install it with: npm install puppeteer"
        );
    }
}

function _ensureHtml(input) {
    if (!input && input !== "") throw new Error("HTML/text input is required");
    // If plain text, wrap simple HTML
    if (typeof input === "string") return input;
    throw new Error("Input must be HTML string or template output");
}

/**
 * Render a simple template string replacing {{key}} with data[key].
 * Does not evaluate code — safe basic replacement.
 * @param {string} template
 * @param {Object} data
 * @returns {string}
 */
function renderFromTemplate(template, data = {}) {
    if (typeof template !== "string") throw new Error("template must be a string");
    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
        const parts = path.split(".");
        let val = data;
        for (const p of parts) {
            val = val == null ? "" : val[p];
        }
        return (val == null) ? "" : String(val);
    });
}

/**
 * Convert HTML (string) to PDF.
 * Node: returns Buffer
 * Browser: returns Blob
 *
 * options:
 *  - node: { puppeteerLaunchOptions } (passed to puppeteer.launch)
 *  - pdfOptions: (paper format / margins) overrides DEFAULT_OPTIONS
 */
async function convertHtmlToPdf(htmlOrTemplate, data = null, options = {}) {
    const html = _ensureHtml(data ? renderFromTemplate(htmlOrTemplate, data) : htmlOrTemplate);
    const pdfOptions = Object.assign({}, DEFAULT_OPTIONS, options.pdfOptions || {});

    // Browser environment
    if (typeof window !== "undefined") {
        // Try html2pdf (auto includes jsPDF & html2canvas) - returns a Promise if configured
        if (typeof window.html2pdf === "function") {
            return new Promise((resolve, reject) => {
                try {
                    const worker = window.html2pdf()
                        .from(html)
                        .set({ margin: 0.2, filename: options.filename || "document.pdf", html2canvas: {}, jsPDF: { unit: "in", format: pdfOptions.format, orientation: pdfOptions.landscape ? "landscape" : "portrait" } })
                        .outputPdf("blob")
                        .then((blob) => resolve(blob))
                        .catch(reject);

                    // in some html2pdf forks .outputPdf may not exist; fallback to saveAs
                    // but we just attempt the common API above
                } catch (err) {
                    reject(err);
                }
            });
        }

        // Try jsPDF with html rendering
        if (typeof window.jspdf !== "undefined" || typeof window.jsPDF !== "undefined") {
            const JS = window.jsPDF || window.jspdf;
            const doc = new JS.jsPDF({ unit: "px", format: pdfOptions.format, orientation: pdfOptions.landscape ? "landscape" : "portrait" });
            // doc.html is async and requires callback — produce dataurlstring
            return new Promise((resolve, reject) => {
                try {
                    doc.html(html, {
                        callback: function (docInstance) {
                            try {
                                const blob = docInstance.output("blob");
                                resolve(blob);
                            } catch (e) {
                                reject(e);
                            }
                        },
                        x: 10,
                        y: 10,
                        width: options.width || undefined,
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }

        throw new Error("No client-side PDF library found. Include html2pdf or jsPDF in the page.");
    }

    // Node environment: use Puppeteer to render headless Chromium to PDF
    const puppeteer = await _requirePuppeteer();
    const launchOptions = Object.assign({ args: ["--no-sandbox", "--disable-setuid-sandbox"] }, options.puppeteerLaunchOptions || {});
    const browser = await puppeteer.launch(launchOptions);
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
        // apply pdf options mapping
        const nodePdfOptions = {
            format: pdfOptions.format,
            printBackground: pdfOptions.printBackground,
            margin: pdfOptions.margin,
            landscape: pdfOptions.landscape,
        };
        const buffer = await page.pdf(nodePdfOptions);
        await page.close();
        await browser.close();
        return buffer;
    } catch (err) {
        await browser.close().catch(() => {});
        throw err;
    }
}

/**
 * Generate an invoice PDF.
 * invoiceData should include: { invoiceNumber, date, billTo, items: [{desc, qty, unitPrice}], notes, logoUrl }
 * template optional: provide HTML template string or use default
 * returns Buffer (Node) or Blob (browser)
 */
async function generateInvoice(invoiceData = {}, template = null, options = {}) {
    if (!invoiceData || typeof invoiceData !== "object") throw new Error("invoiceData object is required");
    const defaultTemplate = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #111; padding: 24px; }
                .invoice-header { display:flex; justify-content:space-between; align-items:center; }
                .items { width:100%; border-collapse: collapse; margin-top: 16px; }
                .items th, .items td { border:1px solid #e6e6e6; padding:8px; text-align:left; }
                .total { text-align:right; margin-top:12px; font-weight:700; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <div>
                    <h2>Invoice</h2>
                    <div>Invoice #: {{invoiceNumber}}</div>
                    <div>Date: {{date}}</div>
                </div>
                <div>
                    {{#if logoUrl}}<img src="{{logoUrl}}" alt="logo" style="max-height:60px"/>{{/if}}
                </div>
            </div>

            <div style="margin-top:16px;">
                <strong>Bill To:</strong>
                <div>{{billTo.name}}</div>
                <div>{{billTo.address}}</div>
            </div>

            <table class="items">
                <thead>
                    <tr><th>Description</th><th>Qty</th><th>Unit</th><th>Amount</th></tr>
                </thead>
                <tbody>
                    {{itemsRows}}
                </tbody>
            </table>

            <div class="total">Total: {{total}}</div>

            <div style="margin-top:20px; color:#666">{{notes}}</div>
        </body>
        </html>
    `;
    // build items rows and compute total
    const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
    let total = 0;
    const itemsRows = items.map(it => {
        const qty = Number(it.qty || 1);
        const unit = Number(it.unitPrice || 0);
        const amt = qty * unit;
        total += amt;
        return `<tr><td>${escapeHtml(it.desc || "")}</td><td>${qty}</td><td>${formatCurrency(unit, invoiceData.currency)}</td><td>${formatCurrency(amt, invoiceData.currency)}</td></tr>`;
    }).join("");
    const tpl = template || defaultTemplate;
    const populated = renderFromTemplate(tpl, Object.assign({}, invoiceData, { itemsRows, total: formatCurrency(total, invoiceData.currency) }));
    return convertHtmlToPdf(populated, null, options);
}

/**
 * Generate a simple report PDF using template and data.
 * template: HTML template string with {{placeholders}}
 */
async function generateReport(reportData = {}, template = null, options = {}) {
    if (!reportData || typeof reportData !== "object") throw new Error("reportData is required");
    const defaultTemplate = `
        <html><head><style>body{font-family:Arial;padding:24px}</style></head>
        <body>
        <h1>{{title}}</h1>
        <div>{{summary}}</div>
        <div style="margin-top:18px">{{content}}</div>
        </body></html>
    `;
    const tpl = template || defaultTemplate;
    const populated = renderFromTemplate(tpl, reportData);
    return convertHtmlToPdf(populated, null, options);
}

/**
 * Generate a certificate PDF.
 * data: { recipientName, courseName, date, signatureUrl }
 */
async function generateCertificate(data = {}, template = null, options = {}) {
    if (!data || typeof data !== "object") throw new Error("data is required");
    const defaultTemplate = `
        <html><head><style>
        body{font-family:Georgia, serif;text-align:center;padding:60px;}
        .title{font-size:36px;font-weight:700}
        .name{font-size:28px;margin-top:24px}
        .meta{color:#666;margin-top:12px}
        </style></head>
        <body>
        <div class="title">Certificate of Completion</div>
        <div class="name">{{recipientName}}</div>
        <div class="meta">has completed {{courseName}} on {{date}}</div>
        {{#if signatureUrl}}<div style="margin-top:40px"><img src="{{signatureUrl}}" style="max-height:60px"/></div>{{/if}}
        </body></html>
    `;
    const tpl = template || defaultTemplate;
    const populated = renderFromTemplate(tpl, data);
    return convertHtmlToPdf(populated, null, options);
}

/**
 * List builtin template names (informational)
 */
function listTemplates() {
    return ["invoice-basic", "report-basic", "certificate-basic"];
}

/* Helpers */
function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatCurrency(value = 0, currency = "USD") {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value));
    } catch (e) {
        return `${currency} ${Number(value).toFixed(2)}`;
    }
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        convertHtmlToPdf,
        generateInvoice,
        generateReport,
        generateCertificate,
        renderFromTemplate,
        listTemplates,
        formatCurrency,
    };
}

// Expose to window for browser usage
if (typeof window !== "undefined") {
    window.PDFGeneratorAPI = {
        convertHtmlToPdf,
        generateInvoice,
        generateReport,
        generateCertificate,
        renderFromTemplate,
        listTemplates,
        formatCurrency,
    };
}