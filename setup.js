const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dependencies = [
  'discord.js@14.0.0',
  '@discordjs/voice',
  '@napi-rs/canvas',
  'dotenv',
  'undici',
  'avconv',
  'ffmpeg',
  'ffmpeg-static',
  'libsodium-wrappers',

];

const devDependencies = [
  'nodemon',
];

const envContent = `TOKEN=your-production-bot-token
CLIENT_ID=your-production-client-id
DEVTOKEN=your-development-bot-token
DEVCLIENT_ID=your-development-client-id
`;

const configContent = `{
  "dev": true
}
`;

// Function to execute a command
function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${command}`, error);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
    }
    if (stdout) {
      console.log(stdout);
    }
    callback();
  });
}

// Step 1: Install packages
console.log('Installing packages...');
execute(`npm install ${dependencies.join(' ')} --save`, () => {
  execute(`npm install ${devDependencies.join(' ')} --save-dev`, () => {
    console.log('Packages installed successfully.');

    // Step 2: Create .env file
    console.log('Creating .env file...');
    fs.writeFileSync(path.join(__dirname, '.env'), envContent, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log('.env file created successfully.');
    });

    // Step 3: Create config.json file
    console.log('Creating config.json file...');
    fs.writeFileSync(path.join(__dirname, '/src/config.json'), configContent, { flag: 'wx' }, (err) => {
      if (err) throw err;
      console.log('config.json file created successfully.');
    });

    // Step 4: Create /db directory
    console.log('Creating /db directory...');
    const dbDir = path.join(__dirname, 'db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
      console.log('/db directory created successfully.');
    } else {
      console.log('/db directory already exists.');
    }

    console.log('Setup completed successfully.');
  });
});
