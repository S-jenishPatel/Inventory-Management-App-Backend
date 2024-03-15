const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

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
