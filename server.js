const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const templateRoute = require("./routes/templateRoutes");
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Enable secure cookies only in production
app.use(cors({
  credentials: true,
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://online-resume-builder-omega.vercel.app/' 
    : 'http://localhost:3000'
}));

app.get("/", (req, res) => {
  res.send("Resume maker Server is Running!");
});

//User Authentication related API
app.use("/api/auth", authRoutes);
app.use("/api/template", templateRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
