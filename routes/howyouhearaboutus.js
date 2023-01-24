const express = require("express");
const router = express.Router();
const {
  HowYouHearAboutUs,
  validateHowYouHearAboutUs,
} = require("../models/howyouhearaboutus");

//POST : CREATE A HOW YOU HEAR ABOUT US
router.post("/createhowyouhearaboutus", async (req, res) => {
  const error = await validateHowYouHearAboutUs(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var howyouhearaboutus = new HowYouHearAboutUs({
    how_you_hear_about_us: req.body.how_you_hear_about_us,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });
  howyouhearaboutus
    .save()
    .then((howyouhearaboutus) => {
      res.send({
        status: 1,
        data: howyouhearaboutus,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get("/howyouhearaboutuslist", (req, res) => {
  HowYouHearAboutUs.find()
    .then((howyouhearaboutus) =>
      res.send({
        status: 1,
        data: howyouhearaboutus,
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
