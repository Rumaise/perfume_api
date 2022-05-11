const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongodb atlas");
  })
  .catch((error) => {
    console.log("something wrong happend", error);
  });

//start server
app.listen(PORT, () => {
  console.log("Server started at PORT", PORT);
});
