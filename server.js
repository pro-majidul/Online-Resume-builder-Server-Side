const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // JSON Middleware

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

// API Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
