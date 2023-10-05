const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    userName: 'daniel@d.com',
    password: "123456",
    apiUrl:"https://api.realworld.io",
  },
  
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["**/1-getting-started", "**/2-advanced-examples"],
  },
});
