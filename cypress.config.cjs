const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: "hooyt1",
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
});