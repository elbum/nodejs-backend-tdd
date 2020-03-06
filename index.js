const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const user = require("./api/user");
const port = 3000;
var morgan = require("morgan");

if (process.env.NODE_ENV != "test") {
  console.log("@@" + process.env.NODE_ENV + "@@");

  app.use(morgan("dev"));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/users", user);

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
