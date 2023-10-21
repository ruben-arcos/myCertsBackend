require("dotenv").config();
const express = require("express");
const authRouter = require("./routers/authRouter")

const app = express();
const port = process.env.PORT || 3330;

app.use(express.json())

app.use('/users', authRouter)

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
