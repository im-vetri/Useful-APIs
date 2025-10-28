/**
 * Email Validator API
 * Validate email addresses with comprehensive checking
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    // RFC 5322 simplified email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Comprehensive email validation
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with details
 */
function validateEmail(email) {
    const result = {
        email: email?.trim() || '',
        isValid: false,
        issues: [],
        warnings: []
    };

    if (!email || typeof email !== 'string') {
        result.issues.push('Email must be a non-empty string');
        return result;
    }

    const trimmedEmail = email.trim();
    result.email = trimmedEmail;

    // Check format
    if (!isValidEmail(trimmedEmail)) {
        result.issues.push('Invalid email format');
        return result;
    }

    const [localPart, domain] = trimmedEmail.split('@');

    // Check local part (before @)
    if (localPart.length === 0 || localPart.length > 64) {
        result.issues.push('Local part must be 1-64 characters');
        return result;
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        result.issues.push('Local part cannot start or end with a dot');
        return result;
    }

    if (localPart.includes('..')) {
        result.issues.push('Local part cannot contain consecutive dots');
        return result;
    }

    // Check for valid characters in local part
    const invalidChars = /[^a-zA-Z0-9._+-]/;
    if (invalidChars.test(localPart)) {
        result.issues.push('Local part contains invalid characters');
        return result;
    }

    // Check domain
    if (domain.length === 0 || domain.length > 255) {
        result.issues.push('Domain must be 1-255 characters');
        return result;
    }

    if (!domain.includes('.')) {
        result.issues.push('Domain must contain at least one dot');
        return result;
    }

    const domainParts = domain.split('.');
    for (const part of domainParts) {
        if (part.length === 0) {
            result.issues.push('Domain parts cannot be empty');
            return result;
        }
        if (part.startsWith('-') || part.endsWith('-')) {
            result.issues.push('Domain parts cannot start or end with hyphen');
            return result;
        }
    }

    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || tld.length > 6) {
        result.warnings.push('Top-level domain has unusual length');
    }

    if (!/^[a-z]+$/i.test(tld)) {
        result.warnings.push('Top-level domain contains non-alphabetic characters');
    }

    result.isValid = result.issues.length === 0;
    result.localPart = localPart;
    result.domain = domain;

    return result;
}

/**
 * Checks if email domain has common typos
 * @param {string} email - Email address
 * @returns {Object} Typo check results
 */
function checkEmailTypos(email) {
    const commonDomains = {
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'yaho.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'aol.comm': 'aol.com',
        'protonmial.com': 'protonmail.com',
        'icloud.comm': 'icloud.com'
    };

    const validation = validateEmail(email);
    if (!validation.isValid) {
        return { email, hasTypo: false, suggestion: null };
    }

    const domain = validation.domain.toLowerCase();
    const suggestion = commonDomains[domain];

    return {
        email,
        hasTypo: !!suggestion,
        suggestion: suggestion || null,
        correctedEmail: suggestion ? `${validation.localPart}@${suggestion}` : null
    };
}

/**
 * Validates multiple emails
 * @param {string[]} emails - Array of emails to validate
 * @returns {Object} Results for all emails
 */
function validateMultipleEmails(emails) {
    if (!Array.isArray(emails)) {
        throw new Error('Input must be an array of emails');
    }

    return {
        total: emails.length,
        valid: emails.filter(e => isValidEmail(e)).length,
        invalid: emails.filter(e => !isValidEmail(e)).length,
        results: emails.map(email => ({
            email,
            isValid: isValidEmail(email)
        }))
    };
}

/**
 * Gets email statistics
 * @param {string} email - Email address
 * @returns {Object} Email statistics
 */
function getEmailStats(email) {
    const validation = validateEmail(email);

    if (!validation.isValid) {
        return null;
    }

    return {
        email,
        length: email.length,
        localPartLength: validation.localPart.length,
        domainLength: validation.domain.length,
        hasNumbers: /\d/.test(validation.localPart),
        hasSpecialChars: /[._+-]/.test(validation.localPart),
        domainParts: validation.domain.split('.').length
    };
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateEmail,
        checkEmailTypos,
        validateMultipleEmails,
        getEmailStats
    };
}

if (typeof window !== 'undefined') {
    window.emailValidatorAPI = {
        isValidEmail,
        validateEmail,
        checkEmailTypos,
        validateMultipleEmails,
        getEmailStats
    };
}
