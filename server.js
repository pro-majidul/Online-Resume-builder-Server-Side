const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware

app.use(express.json());
app.use(cors());

// routes

app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

app.listen(port, (req, res) => {
  console.log(` Server running at http://localhost:${port}`);
});
