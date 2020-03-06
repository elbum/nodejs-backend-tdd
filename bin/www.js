const app = require("../index");
const syncDb = require("./sync-db");

syncDb().then(() => {
  app.listen(3000, () => {
    console.log("Server running...");
  });
});
