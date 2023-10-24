require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const certificatesRouter = require("./routers/certificatesRouter")

const app = express();
const port = process.env.PORT || 3330;

app.use(cors());
app.use(express.json());

app.use("/users", authRouter);
app.use("/certificates", certificatesRouter);

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
