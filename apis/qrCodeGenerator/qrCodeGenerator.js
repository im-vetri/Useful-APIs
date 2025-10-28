/**
 * QR Code Generator API
 * Generate QR codes from text, URLs, and data using qrserver.com
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://api.qrserver.com/v1/create-qr-code";

/**
 * Generates a QR code for text or URL
 * @param {string} data - Text or URL to encode
 * @param {Object} options - Options (size, format, errorCorrection, margin)
 * @returns {Promise<string>} QR code image URL or data
 */
async function generateQRCode(data, options = {}) {
    try {
        if (!data || typeof data !== 'string') {
            throw new Error('Data must be a non-empty string');
        }

        const {
            size = 200,
            format = 'png',
            errorCorrection = 'M',
            margin = 0
        } = options;

        if (size < 50 || size > 1000) {
            throw new Error('Size must be between 50 and 1000');
        }

        if (!['L', 'M', 'Q', 'H'].includes(errorCorrection)) {
            throw new Error('Error correction must be L, M, Q, or H');
        }

        let url = `${BASE_URL}/?size=${size}x${size}`;
        url += `&data=${encodeURIComponent(data)}`;
        url += `&format=${format}`;
        url += `&ecc=${errorCorrection}`;
        url += `&margin=${margin}`;

        return url;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

/**
 * Generates QR code and returns base64 data
 * @param {string} data - Text or URL to encode
 * @param {Object} options - Options
 * @returns {Promise<Object>} QR code data with url and base64
 */
async function generateQRCodeBase64(data, options = {}) {
    try {
        const qrUrl = await generateQRCode(data, options);
        const response = await fetch(qrUrl);

        if (!response.ok) {
            throw new Error('Failed to generate QR code');
        }

        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve({
                    url: qrUrl,
                    base64: reader.result,
                    timestamp: new Date().toISOString()
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error generating QR code base64:', error);
        throw error;
    }
}

/**
 * Generates multiple QR codes
 * @param {string[]} dataArray - Array of text/URLs to encode
 * @param {Object} options - Options
 * @returns {Promise<Array>} Array of QR code URLs
 */
async function generateMultipleQRCodes(dataArray, options = {}) {
    try {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array must be non-empty');
        }

        const results = [];
        for (const data of dataArray) {
            const url = await generateQRCode(data, options);
            results.push({
                data: data,
                url: url
            });
        }
        return results;
    } catch (error) {
        console.error('Error generating multiple QR codes:', error);
        throw error;
    }
}

/**
 * Gets QR code statistics
 * @returns {Object} QR code configuration options
 */
function getQRCodeOptions() {
    return {
        formats: ['png', 'jpg', 'svg', 'eps', 'pdf'],
        errorCorrection: {
            'L': 'Low (7% recovery)',
            'M': 'Medium (15% recovery)',
            'Q': 'Quartile (25% recovery)',
            'H': 'High (30% recovery)'
        },
        sizes: {
            small: 150,
            medium: 300,
            large: 500,
            extraLarge: 800
        }
    };
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateQRCode,
        generateQRCodeBase64,
        generateMultipleQRCodes,
        getQRCodeOptions
    };
}

if (typeof window !== 'undefined') {
    window.qrCodeAPI = {
        generateQRCode,
        generateQRCodeBase64,
        generateMultipleQRCodes,
        getQRCodeOptions
    };
}
