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

const allowedOrigins =[
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

app.use("/backend/api", productRouter);
app.use("/backend/api/users", usrRouter);
app.use("/backend/api/admins", adminRouter);
app.use('/backend/api/reviews', reviewRoutes);
app.use('/backend/api/sales', salesRouter);
app.use('/backend/api/promotion', new_letter_router);
app.use('/backend/api/addsOn_product', Adds_products_router);

app.get("/backend", function (req, res) {



  res.send("Hellow World");
});

connect();
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening at https://localhost:${PORT}`);

});

module.exports = app;
