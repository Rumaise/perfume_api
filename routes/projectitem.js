const express = require("express");
const { default: mongoose } = require("mongoose");
const { Project } = require("../models/project");
const router = express.Router();
const { ProjectItem, validateProjectItem } = require("../models/projectitems");

// POST : CREATE A NEW  PROJECT ITEM

router.post("/createprojectitem", async (req, res) => {
  const error = await validateProjectItem(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var projectitem = new ProjectItem({
    project_id: req.body.project_id,
    item_id: req.body.item_id,
    available_quantity: req.body.available_quantity,
    allocated_quantity: req.body.allocated_quantity,
    total_quantity: req.body.total_quantity,
    required_quantity: req.body.required_quantity,
    balance_quantity: req.body.balance_quantity,
    order_referrence: req.body.order_referrence,
    vendor_name: req.body.vendor_name,
    order_date: req.body.order_date,
    remarks: req.body.remarks,
    expected_delivery_date: req.body.expected_delivery_date,
    received_date: req.body.received_date,
    created_by: req.body.created_by,
  });
  projectitem
    .save()
    .then((projectitem) => {
      res.send({
        status: 1,
        data: projectitem,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

router.put("/updateprojectitem/:id", async (req, res) => {
  const projectitemupdate = await ProjectItem.findByIdAndUpdate(
    req.params.id,
    {
      project_id: req.body.project_id,
      item_id: req.body.item_id,
      available_quantity: req.body.available_quantity,
      allocated_quantity: req.body.allocated_quantity,
      total_quantity: req.body.total_quantity,
      required_quantity: req.body.required_quantity,
      balance_quantity: req.body.balance_quantity,
      order_referrence: req.body.order_referrence,
      vendor_name: req.body.vendor_name,
      order_date: req.body.order_date,
      remarks: req.body.remarks,
      expected_delivery_date: req.body.expected_delivery_date,
      received_date: req.body.received_date,
      created_by: req.body.created_by,
    },
    { new: true }
  );
  if (!projectitemupdate)
    res.status(404).send({
      status: 0,
      data: " Project Item Not Found",
    });
  res.send({
    status: 1,
    data: projectitemupdate,
  });
});

router.get("/projectitemslist", (req, res) => {
  ProjectItem.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project_id",
        foreignField: "_id",
        as: "project_details",
        pipeline: [],
      },
    },
  ])
    .then((projectitems) =>
      res.send({
        status: 1,
        data: projectitems,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET ALL PROJECT ITEMS COUNT

router.get("/projectitemscount", (req, res) => {
  ProjectItem.estimatedDocumentCount()
    .then((projectitemcount) =>
      res.send({
        status: 1,
        data: projectitemcount,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//api to get the collection count
router.get("/projectitemslistcountbyfromandtodate/:from/:to", (req, res) => {
  console.log(req.params.from);
  console.log(req.params.to);
  ProjectItem.aggregate([
    {
      $match: {
        expected_delivery_date: { $exists: true },
      },
    },
    {
      $project: {
        _id: 1,
        formattedDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$expected_delivery_date",
          },
        },
      },
    },
    {
      $addFields: {
        convert: {
          $dateFromString: {
            dateString: "$formattedDate",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        formattedDate: 1,
        convert: 1,
      },
    },
    {
      $match: {
        convert: {
          $gte: new Date(req.params.from),
          $lte: new Date(req.params.to),
        },
      },
    },
    {
      $count: "totalgoodslistcount",
    },
  ])
    .then((projectitems) =>
      res.send({
        status: 1,
        data: projectitems,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//api to get the collection count for received date
router.get(
  "/projectitemslistcountbyfromandtodatebyreceiveddate/:from/:to",
  (req, res) => {
    console.log(req.params.from);
    console.log(req.params.to);
    ProjectItem.aggregate([
      {
        $match: {
          received_date: { $exists: true },
        },
      },
      {
        $project: {
          _id: 1,
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$received_date",
            },
          },
        },
      },
      {
        $addFields: {
          convert: {
            $dateFromString: {
              dateString: "$formattedDate",
              format: "%Y-%m-%d",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          formattedDate: 1,
          convert: 1,
        },
      },
      {
        $match: {
          convert: {
            $gte: new Date(req.params.from),
            $lte: new Date(req.params.to),
          },
        },
      },
      {
        $count: "totalreceivedgoodslistcount",
      },
    ])
      .then((projectitems) =>
        res.send({
          status: 1,
          data: projectitems,
        })
      )
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error.message,
        });
      });
  }
);

router.get("/projectitemslistbypaginate/:page/:count/:term?", (req, res) => {
  if (req.params.term) {
    ProjectItem.aggregatePaginate(
      ProjectItem.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "_id",
            as: "project_details",
            pipeline: [],
          },
        },
        {
          $match: {
            $or: [
              {
                item_id: {
                  $regex: ".*" + req.params.term + ".*",
                  $options: "i",
                },
              },
              {
                order_referrence: {
                  $regex: ".*" + req.params.term + ".*",
                  $options: "i",
                },
              },
              {
                "project_details.referrence": {
                  $regex: ".*" + req.params.term + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
      ]),
      { page: req.params.page, limit: req.params.count }
    )
      .then((projectitem) =>
        res.send({
          status: 1,
          data: projectitem,
        })
      )
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error.message,
        });
      });
  } else {
    ProjectItem.aggregatePaginate(
      ProjectItem.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "_id",
            as: "project_details",
            pipeline: [],
          },
        },
      ]),
      { page: req.params.page, limit: req.params.count }
    )
      .then((projectitem) =>
        res.send({
          status: 1,
          data: projectitem,
        })
      )
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error.message,
        });
      });
  }
});

router.get("/projectitemsbyid/:id", (req, res) => {
  ProjectItem.aggregate([
    {
      $match: { project_id: { $eq: mongoose.Types.ObjectId(req.params.id) } },
    },
  ])
    .then((projectitems) =>
      res.send({
        status: 1,
        data: projectitems,
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
