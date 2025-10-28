# Random User Generator API

A wrapper around the RandomUser API that generates random but realistic user profiles for testing and development.

## Installation

Include the script in your project:

Browser:
```html
<script src="randomUser.js"></script>
```

Node.js:
```javascript
const { getRandomUser, getRandomUsers, getSingleUser } = require("./randomUser.js");
```

## API Reference

### getSingleUser(gender)

Get a single random user.

Parameters:
- `gender` (string, optional): Filter by gender - 'male', 'female', or null for all

Returns: Promise that resolves to a user object

Example:
```javascript
const user = await getSingleUser("female");
console.log(user.name.first);  // User's first name
console.log(user.email);        // User's email
```

### getRandomUsers(count, filters)

Get multiple random users.

Parameters:
- `count` (number): Number of users to fetch
- `filters` (object, optional): Filter options
  - `gender` (string): 'male' or 'female'
  - `nationality` (string): ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')

Returns: Promise that resolves to an array of user objects

Example:
```javascript
const users = await getRandomUsers(5, {
  gender: "male",
  nationality: "US"
});
```

### getRandomUser(results, gender, nationality)

Get users with full control over all parameters.

Parameters:
- `results` (number): Number of users to fetch (1-5000)
- `gender` (string): 'male', 'female', or 'all'
- `nationality` (string): ISO 3166-1 alpha-2 country code

Returns: Promise that resolves to the full API response object

Example:
```javascript
const data = await getRandomUser(10, "female", "FR");
console.log(data.results);  // Array of users
console.log(data.info);     // API metadata
```

## Response Format

Each user object contains:

```json
{
  "gender": "female",
  "name": {
    "title": "Ms",
    "first": "Emma",
    "last": "Johnson"
  },
  "email": "emma.johnson@example.com",
  "phone": "(555) 123-4567",
  "cell": "(555) 987-6543",
  "picture": {
    "large": "https://randomuser.me/api/portraits/women/1.jpg",
    "medium": "https://randomuser.me/api/portraits/med/women/1.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/women/1.jpg"
  },
  "location": {
    "street": {
      "number": 1234,
      "name": "Main Street"
    },
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "postcode": "10001",
    "coordinates": {
      "latitude": "40.7128",
      "longitude": "-74.0060"
    },
    "timezone": {
      "offset": "-05:00",
      "description": "Eastern Time (US & Canada)"
    }
  },
  "dob": {
    "date": "1990-05-15T10:30:00.000Z",
    "age": 34
  },
  "registered": {
    "date": "2010-03-20T08:15:00.000Z",
    "age": 14
  },
  "login": {
    "username": "emmajohnson",
    "password": "password123",
    "salt": "abcde12345",
    "md5": "abc123def456",
    "sha1": "sha1hash",
    "sha256": "sha256hash"
  },
  "id": {
    "name": "SSN",
    "value": "123-45-6789"
  },
  "nat": "US"
}
```

## Use Cases

Testing: Generate mock users for test cases
```javascript
const user = await getSingleUser();
await testSignupForm(user.email, user.name.first);
```

Database Seeding: Create test data for your database
```javascript
const users = await getRandomUsers(100);
for (let user of users) {
  await database.insert(user);
}
```

UI Development: Populate mockups with realistic data
```javascript
const users = await getRandomUsers(10);
renderUserList(users);
```

## Supported Countries

The API supports all ISO 3166-1 alpha-2 country codes. Some examples:

US - United States
GB - United Kingdom
FR - France
DE - Germany
JP - Japan
IN - India
AU - Australia
CA - Canada
BR - Brazil
MX - Mexico

## Error Handling

The API throws errors for invalid input:

```javascript
try {
  const users = await getRandomUsers(10000);  // Max is 5000
} catch (error) {
  console.error("Error:", error.message);
}
```

## Browser Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="randomUser.js"></script>
</head>
<body>
  <button id="loadBtn">Load Random User</button>
  <div id="userCard"></div>

  <script>
    document.getElementById("loadBtn").addEventListener("click", async () => {
      try {
        const user = await window.RandomUserAPI.getSingleUser();
        document.getElementById("userCard").innerHTML = `
          <img src="${user.picture.large}" />
          <p>${user.name.first} ${user.name.last}</p>
          <p>${user.email}</p>
        `;
      } catch (error) {
        console.error(error);
      }
    });
  </script>
</body>
</html>
```

## Node.js Example

```javascript
const { getRandomUsers } = require("./randomUser.js");

async function main() {
  try {
    const users = await getRandomUsers(3, { gender: "female" });
    users.forEach((user) => {
      console.log(`${user.name.first} ${user.name.last} - ${user.email}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
```

## Notes

- Data is generated randomly each time
- No authentication required
- Based on RandomUser.me API
- See CONTRIBUTING.md for guidelines on adding new features
