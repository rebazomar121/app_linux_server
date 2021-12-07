const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
const cors = require("cors");

dotenv.config();

// set up server

const app = express();
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json());

// coockieParser use for change cookie to change cookie to js code 
app.use(cookieParser())
// this will just return data for one front end {we get it}
app.use(cors({
  origin:['http://localhost:3000'],
  // this will allow to website store cookie
  credentials:true
}));

// connect to mongoDB
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

// set up routes

app.use("/api/auth", require("./routers/userRouter"));
app.use("/api/customer", require("./routers/customerRouter"));
