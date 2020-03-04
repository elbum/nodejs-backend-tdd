const express = require("express");
const app = express();
const morgan = require("morgan");

function logger(req, res, next) {
  console.log("i am logger");
  next();
}

function logger2(req, res, next) {
  console.log("i am  logger 2");
  next();
}

function commonMw(req, res, next) {
  console.log("common middle ware");
  next(new Error("error occured"));
}

function commonMw2(err, req, res, next) {
  console.log(err.message, "WOW");
  next();
}

app.use(commonMw);
app.use(commonMw2);
app.use(morgan("dev"));
app.listen(3000, function() {
  console.log("Server is running...");
});
