const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const app = express();
require("dotenv").config();

const categoryRoute = require("./routes/category");
const subcategoryRoute = require("./routes/subcategory");
const subcategoryitemsRoute = require("./routes/subcategoryitems");
const customerRoute = require("./routes/customer");
const projectRoute = require("./routes/project");
const uploadRoute = require("./routes/uploadimagerouter");
const projectDetailsRoute = require("./routes/projectdetails");
const userGroupRoute = require("./routes/usergroup");
const userRoute = require("./routes/user");

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

app.use("/upload/images", express.static("upload/images"));

//routes
app.use("/api", categoryRoute);
app.use("/subcategory", subcategoryRoute);
app.use("/subcategoryitems", subcategoryitemsRoute);
app.use("/customer", customerRoute);
app.use("/project", projectRoute);
app.use("/projectdetails", projectDetailsRoute);
app.use("/document", uploadRoute);
app.use("/usergroup", userGroupRoute);
app.use("/user", userRoute);

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
