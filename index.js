const express = require("express");
const app = express();

const usrRouter = require("./routes/users");
const productRouter = require('./routes/productRoutes')
const adminRouter = require("./routes/admin");
let cookieParser = require('cookie-parser');  
const reviewRoutes = require('./routes/review');



const connect = require("./helper/connect");
require("dotenv").config();
const cors = require("cors");
const PORT = 3200;
app.use(cors());
app.use(express.json());

app.use(cookieParser());   

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'https://interiorfilm.vercel.app' ,
  "http://192.168.1.37:3000",
  "https://interiorfilms.netlify.app"
];

// Custom CORS options
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.use("/api", productRouter);
app.use("/api/users", usrRouter);
app.use("/api/admins", adminRouter);
app.use('/api/reviews', reviewRoutes);



app.get("/", function (req, res) {
  res.send("Hellow World");
});

connect();
app.listen(PORT, () => {
  console.log(`Server is listening at https://localhost:${PORT}`);

});

module.exports = app;
