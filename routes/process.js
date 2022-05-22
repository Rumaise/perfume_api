const express = require("express");
const router = express.Router();
const { Process, validateProcess } = require("../models/process");

//POST : CREATE A NEW PROCESS
router.post("/createprocess", async (req, res) => {
  const error = await validateProcess(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var process = new Process({
    process_name: req.body.process_name,
    approvers: req.body.approvers,
    notify: req.body.notify,
    mailstat: req.body.mailstat,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  process
    .save()
    .then((process) => {
      res.send({
        status: 1,
        data: process,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROCESS

router.get("/listprocess", (req, res) => {
  Process.find()
    .then((processes) =>
      res.send({
        status: 1,
        data: processes,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/processdropdown/:projectid/:createdby", async (req, res) => {
  console.log(req.params.projectid);
  console.log(req.params.createdby);
  await Process.find()
    .then(async (processes) => {
      var resultarray = [];
      await processes.forEach((element) => {
        const data = {
          project_id: req.params.projectid,
          created_by: req.params.createdby,
          process_id: element._id,
          process_name: element.process_name,
          selected: false,
        };
        console.log(data);
        resultarray.push(data);
      });
      res.send({
        status: 1,
        data: resultarray,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

module.exports = router;
