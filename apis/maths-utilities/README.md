# 🧮 Math Utilities API

A handy API for performing basic math operations.

## 📡 Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/add/:a/:b` | Adds two numbers. |
| GET | `/api/factorial/:n` | Returns factorial of n. |
| GET | `/api/prime/:n` | Checks if n is a prime number. |

## Example Response
```json
{
  "n": 7,
  "isPrime": true
}
