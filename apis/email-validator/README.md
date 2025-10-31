# 📧 Email Validator API

Validates email addresses for proper format and domain structure.

## Endpoint
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/validate/:email` | Validates given email. |

## Example
```bash
GET /api/validate/test@gmail.com
```

Response
```
{ "email": "test@gmail.com", "valid": true, "domain": "gmail.com" }
```