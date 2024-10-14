const express = require("express");
const app = express();

const usrRouter = require("./routes/users");
const productRouter = require('./routes/productRoutes')
const adminRouter = require("./routes/admin");
const salesRouter = require("./routes/sales");
const new_letter_router = require("./routes/news_letter_routes");
const Adds_products_router = require("./routes/adds_productRoutes");



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
  'https://interiorfilm.vercel.app',
  "http://192.168.1.37:3000",
  "https://interiorfilms.netlify.app",
  "https://interiorfilm.ae"
];

const corsOptions = {
  origin: function (origin, callback) {
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
app.use('/api/sales', salesRouter);
app.use('/api/promotion', new_letter_router);
app.use('/api/addsOn_product', Adds_products_router);




app.get("/", function (req, res) {
  console.log("Hello world")
  res.send("Hellow World");
});

connect();
app.listen(PORT, () => {
  console.log(`Server is listening at https://localhost:${PORT}`);

});

module.exports = app;
