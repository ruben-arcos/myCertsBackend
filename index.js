require("dotenv").config();
const express = require("express");
const db = require("./utils/db.js");

const app = express();
const port = process.env.PORT || 3330;

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.get("/home", (req, res) => {
  res.send("welcome to home route!!!!!!!!");
});

app.get("/porkchop", (req, res) => {
  console.log(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PWD,
    process.env.DB_NAME
  );
  console.log("inside porkchop route");
  db.query("SELECT * from regUsers", (error, rows) => {
    console.log(error);
    if (error) {
      return res.send(error);
    }
    res.send(rows);
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
