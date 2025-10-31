# ⏰ Date & Time Formatter API

This API formats timestamps and retrieves readable time strings.

## Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/now` | Current date & time. |
| GET | `/api/format/:timestamp` | Converts timestamp into human-readable format. |

## Example
```bash
GET /api/format/1730365200000
```

Response
```
{ "formatted": "31-10-2025 18:00:00" }
```