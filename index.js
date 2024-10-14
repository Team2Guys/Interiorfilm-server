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



app.get("/backend", function (req, res) {
  res.send("Hellow World");
});

connect();
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening at https://localhost:${PORT}`);

});

module.exports = app;
