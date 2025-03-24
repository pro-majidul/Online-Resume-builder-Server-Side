const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:3000', ],  // Allow only frontend origin
  credentials: true  // Allow cookies and authentication headers
}));

app.get("/", (req, res) => {
  res.send("Resume maker Server is Running!");
});

//User Authentication related API
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
