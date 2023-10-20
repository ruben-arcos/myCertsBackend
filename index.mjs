import express from "express";

const app = express();
const port = process.env.PORT || 3330;

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.get("/home", (req, res) => {
  res.send("welcome to home route!!!!!!!!");
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
