/**
 * Random User Generator API - Node.js Example
 * 
 * Run with: node randomUser-node.js
 */

const { getRandomUser, getRandomUsers, getSingleUser } = require("../apis/randomUser/randomUser.js");

// Example 1: Get a single random user
async function example1() {
  console.log("\n=== Example 1: Get a Single Random User ===");
  try {
    const user = await getSingleUser();
    console.log(`Name: ${user.name.first} ${user.name.last}`);
    console.log(`Email: ${user.email}`);
    console.log(`Location: ${user.location.city}, ${user.location.country}`);
    console.log(`Age: ${user.dob.age}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 2: Get multiple users
async function example2() {
  console.log("\n=== Example 2: Get Multiple Random Users ===");
  try {
    const users = await getRandomUsers(3);
    console.log(`Fetched ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name.first} ${user.name.last} - ${user.email}`
      );
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 3: Get users with filters
async function example3() {
  console.log("\n=== Example 3: Get Female Users from US ===");
  try {
    const users = await getRandomUsers(2, {
      gender: "female",
      nationality: "US",
    });
    console.log(`Fetched ${users.length} users:`);
    users.forEach((user) => {
      console.log(
        `${user.name.first} ${user.name.last} - ${user.location.city}, ${user.location.country}`
      );
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 4: Get male users with full response
async function example4() {
  console.log("\n=== Example 4: Get Male Users with Full Response ===");
  try {
    const data = await getRandomUser(2, "male");
    console.log(`Total results: ${data.info.results}`);
    data.results.forEach((user) => {
      console.log({
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        username: user.login.username,
        picture: user.picture.large,
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 5: Generate test user objects for database seeding
async function example5() {
  console.log("\n=== Example 5: Generate Test Data for Database ===");
  try {
    const users = await getRandomUsers(5, { gender: "male" });
    const testData = users.map((user) => ({
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      phone: user.phone,
      country: user.location.country,
      city: user.location.city,
      profilePicture: user.picture.large,
      dob: user.dob.date,
      gender: user.gender,
    }));

    console.log("Generated test data (JSON format):");
    console.log(JSON.stringify(testData, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run all examples
async function runAllExamples() {
  console.log("🎲 Random User Generator API - Examples");
  console.log("=====================================");

  await example1();
  await example2();
  await example3();
  await example4();
  await example5();

  console.log("\n✅ All examples completed!");
}

// Run the examples
runAllExamples();
