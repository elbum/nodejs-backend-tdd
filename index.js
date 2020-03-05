const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = 3000;

var morgan = require("morgan");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var users = [
  { id: 1, name: "alice" },
  { id: 2, name: "beck" },
  { id: 3, name: "happy" }
];

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
  // res.send("Hello World!22");
  console.log("hello sent");
});

app.get("/users/:id", function(req, res) {
  console.log("req.param id =", req.params.id + req.params.id);

  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const user = users.filter(user => user.id === id)[0];
  // const user1 = users.filter(user => user.id === id)[1];
  if (!user) return res.status(404).end();

  console.log("user id===1인거는", user.id === id);

  res.json(user);
});

app.delete("/users/:id", function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  users = users.filter(user => user.id !== id);
  res.status(204).end();
});

app.put("/users/:id", function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const name = req.body.name;
  if (!name) return res.status(404).end();
  const conflict = users.filter(user => user.name === name).length;
  if (conflict) return res.status(409).end();

  // const user = users.filter(user => user.id === id)[0];
  // user.name = name;

  const ret = users.filter(ret => ret.id === id)[0];
  ret.name = name;
  console.log(ret);
  res.json(ret);
});

app.get("/users", (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  res.json(users.slice(0, limit));
  console.log("user sent");
  //console.log(json(users));
});

app.post("/users", (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).end();
  const isConflict = users.filter(user => user.name === name).length;

  if (isConflict) return res.status(409).end();
  console.log("name == ", name);
  const id = Date.now();
  const user = { id, name };
  users.push(user);
  res.status(201).json(user);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
