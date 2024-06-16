const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

var whitelist = [
  process.env.CORS_ORIGIN1,
  process.env.CORS_ORIGIN2,
  process.env.CORS_ORIGIN3,
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true,
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes Import
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const { categoryRouter } = require("./routes/category.routes");

// Routes Decleration
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);

module.exports = app;
