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
    category_id: req.body.category_id,
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

router.get("/listprocessbydetailsbycategory", (req, res) => {
  Process.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "approvers",
        foreignField: "_id",
        as: "approverslist",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "notify",
        foreignField: "_id",
        as: "notifierslist",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $sort: { sort_order: -1 },
    },
    {
      $group: {
        _id: { category: "$category_id" },
        process_details_data: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        category_id: "$_id.category",
        process_details_data: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $unwind: "$category_details",
    },
    {
      $sort: { "category_details.sort_order": 1 },
    },
  ])
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

router.get("/listprocessbydetails", (req, res) => {
  Process.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "approvers",
        foreignField: "_id",
        as: "approverslist",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "notify",
        foreignField: "_id",
        as: "notifierslist",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_details",
      },
    },
  ])
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
          selected: true,
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

router.get(
  "/processdropdownforproject/:projectid/:createdby",
  async (req, res) => {
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
            gesture: true,
            started: false,
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
  }
);

//UPDATE PROJECT BASED ON ID
router.put("/updateprocess/:id", async (req, res) => {
  console.log(req.body.approvers);
  const processupdate = await Process.findByIdAndUpdate(
    req.params.id,
    {
      process_name: req.body.process_name,
      mailstat: req.body.mailstat,
      $set: {
        approvers: req.body.approvers,
        notify: req.body.notify,
      },
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!processupdate)
    res.status(404).send({
      status: 0,
      data: "Process details update failed",
    });
  res.send({
    status: 1,
    data: processupdate,
  });
});

//UPDATE PROJECT SORT ORDER BASED ON ID
router.put("/updateprocesssortorder/:id", async (req, res) => {
  console.log(req.body.sortorder);
  const processupdate = await Process.findByIdAndUpdate(
    req.params.id,
    {
      sort_order: req.body.sortorder,
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!processupdate)
    res.status(404).send({
      status: 0,
      data: "Process details update failed",
    });
  res.send({
    status: 1,
    data: processupdate,
  });
});

module.exports = router;
