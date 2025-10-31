// Simple UUIDv4 Generator
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0,
          v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Custom Token Generator
export function generateToken(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Example:
console.log("UUID:", generateUUID());
console.log("Token (12 chars):", generateToken(12));
