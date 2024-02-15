require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");

const connectDB = require("./config/dbConnection");

const app = require("./app");

const PORT = process.env.PORT || 5000;

connectDB();
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

process.on("uncaughtException", (ex) => {
  console.log(ex);
});
