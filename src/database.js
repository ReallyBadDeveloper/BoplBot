const fs = require('fs');
const path = require('path');

// Adjust the database file path
const dbDir = path.join(__dirname, '../db');
const dbPath = path.join(dbDir, 'friendcodes.json');

// Make Exist
function MakeExist() {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

// Init
MakeExist();

// Read
function readDatabase() {
  return JSON.parse(fs.readFileSync(dbPath));
}

// Write
function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Get code
function GetCode(userId) {
  const db = readDatabase();
  return db[userId] || null;
}

// Set code
function SetCode(userId, friendCode) {
  const db = readDatabase();
  db[userId] = friendCode;
  writeDatabase(db);
}

module.exports = {
  GetCode,
  SetCode,
};
