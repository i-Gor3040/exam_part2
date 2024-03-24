const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1920, 
  viewportHeight: 1080,
  watchForFileChanges: false,
 retries: {
      runMode: 2,
      openMode: 2
  },

  e2e: {  
    baseUrl: 'https://juice-shop-sanitarskyi.herokuapp.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});