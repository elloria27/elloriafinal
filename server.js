
// Simple script to run the Express server during development
// Run with: node server.js
require('dotenv').config();
const { exec } = require('child_process');

console.log('Compiling TypeScript server...');
exec('npx tsc --project tsconfig.server.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`Compilation error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`Compilation stderr: ${stderr}`);
  }
  
  if (stdout) {
    console.log(stdout);
  }
  
  console.log('Starting Express server...');
  const server = exec('node dist/server/index.js');
  
  server.stdout.on('data', (data) => {
    console.log(data);
  });
  
  server.stderr.on('data', (data) => {
    console.error(data);
  });
});
