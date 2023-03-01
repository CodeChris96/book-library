const express = require("express");

const cors = require("cors");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

app.get("/test", (req, res) => {
  return res.status(200).json({ Message: "Hello World!" });
});

module.exports = app;
