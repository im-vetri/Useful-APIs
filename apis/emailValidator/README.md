# Email Validator API

Comprehensive email validation with format checking, typo detection, and batch validation. Zero dependencies.

## Quick Start

### Browser
```html
<script src="emailValidator.js"></script>

<script>
  // Validate email
  const result = emailValidatorAPI.validateEmail('user@example.com');
  console.log(result.isValid); // true
  
  // Check for typos
  const typoCheck = emailValidatorAPI.checkEmailTypos('user@gmial.com');
  console.log(typoCheck.suggestion); // gmail.com
</script>
```

### Node.js
```javascript
const { validateEmail, checkEmailTypos } = require('./emailValidator.js');

// Simple validation
console.log(validateEmail('test@example.com').isValid);

// Typo detection
const check = checkEmailTypos('user@yahooo.com');
if (check.hasTypo) {
  console.log(`Did you mean ${check.correctedEmail}?`);
}
```

## API Functions

| Function | Description |
|----------|-------------|
| `isValidEmail(email)` | Quick boolean validation |
| `validateEmail(email)` | Detailed validation with issues |
| `checkEmailTypos(email)` | Detect common domain typos |
| `validateMultipleEmails(array)` | Validate batch of emails |
| `getEmailStats(email)` | Get email statistics |

## Examples

### Validate Email
```javascript
const result = emailValidatorAPI.validateEmail('john.doe@example.com');
// Returns: { isValid: true, localPart: 'john.doe', domain: 'example.com' }
```

### Detect Typos
```javascript
const check = emailValidatorAPI.checkEmailTypos('user@gmial.com');
// Returns: { hasTypo: true, suggestion: 'gmail.com', correctedEmail: 'user@gmail.com' }
```

## License

MIT
