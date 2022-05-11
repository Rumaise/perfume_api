const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const categoryRoute = require("./routes/category");

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/createcategory", categoryRoute);
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
