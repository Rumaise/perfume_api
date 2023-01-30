const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { Volume, validateVolume } = require("../models/volume");

//POST : CREATE A NEW  VOLUME
router.post("/createvolume", async (req, res) => {
  const error = await validateVolume(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var volume = new Volume({
    volume_name: req.body.volume_name,
    created_by: req.body.created_by,
  });
  volume
    .save()
    .then((volume) => {
      res.send({
        status: 1,
        data: volume,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL VOLUMES
router.get("/listvolumes", (req, res) => {
  Volume.find()
    .then((volumes) =>
      res.send({
        status: 1,
        data: volumes,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

module.exports = router;
