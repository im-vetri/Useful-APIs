# 🔐 Password Strength Checker API

Checks how strong a given password is based on multiple security factors.

## Endpoint
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/check` | Analyzes password strength. |

## Example Request
```bash
POST /api/check
Content-Type: application/json

{ "password": "MyP@ssw0rd123" }
```

Response
```
{ "password": "MyP@ssw0rd123", "score": 4, "strength": "Very Strong" }
```