const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const app = express();
require("dotenv").config();

const categoryRoute = require("./routes/category");
const subcategoryRoute = require("./routes/subcategory");

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create a logger
const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

//routes
app.use("/api", categoryRoute);
app.use("/subcategory", subcategoryRoute);
//connect to mongodb
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    logger.log("info", "connected to mongodb atlas");
  })
  .catch((error) => {
    logger.log("error", error);
  });

//start server
app.listen(PORT, () => {
  logger.log("info", "Server started at PORT", PORT);
});
