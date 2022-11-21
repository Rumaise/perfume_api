const express = require("express");
const projectmain = require("../models/projectmain");
const router = express.Router();
const { ProjectMain, validateProjectMain } = require("../models/projectmain");
const { default: mongoose } = require("mongoose");

//POST : CREATE A NEW PROJECT MAIN

router.post("/createprojectmain", async (req, res) => {
  const error = await validateProjectMain(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var projectmain = new ProjectMain({
    project_id: req.body.project_id,
    customer_id: req.body.customer_id,
    main_category_id: req.body.main_category_id,
    detailname: req.body.detailname,
    itemcode: req.body.itemcode,
    volume: req.body.volume,
    remarks: req.body.remarks,
    photolink: req.body.photolink,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  projectmain
    .save()
    .then((projectmain) => {
      res.send({
        status: 1,
        data: projectmain,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECTS MAIN

router.get("/projectmainlist", (req, res) => {
  ProjectMain.find()
    .then((projectmain) =>
      res.send({
        status: 1,
        data: projectmain,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE PROJECT MAIN BY ID
router.get("/projectmain/:id", async (req, res) => {
  const projectmaindetails = await ProjectMain.findById(req.params.id);
  if (!projectmaindetails)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmaindetails,
  });
});

//GET THE PROJECT MAIN BY PROJECT ID , CUSTOMER ID AND MAIN CATEGORY ID
router.get(
  "/projectmaindetailsbyprojectid/:projectid/:customerid/:categoryid",
  async (req, res) => {
    ProjectMain.aggregate([
      {
        $match: {
          $and: [
            {
              project_id: mongoose.Types.ObjectId(req.params.projectid),
            },
            {
              customer_id: mongoose.Types.ObjectId(req.params.customerid),
            },
            {
              main_category_id: mongoose.Types.ObjectId(req.params.categoryid),
            },
          ],
        },
      },
    ])
      .then((projectmaindetails) =>
        res.send({
          status: 1,
          data: projectmaindetails,
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

//GET THE PROJECT MAIN BY PROJECT ID
router.get("/projectmaindetailsbyprojectid/:projectid", async (req, res) => {
  ProjectMain.aggregate([
    {
      $match: {
        $and: [
          {
            project_id: mongoose.Types.ObjectId(req.params.projectid),
          },
        ],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "main_category_id",
        foreignField: "_id",
        as: "category_name",
      },
    },

    {
      $unwind: "$details",
    },
    {
      $lookup: {
        from: "subcategories",
        as: "subcategory_details",
        let: {
          subcategoryid: "$details.sub_category_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$subcategoryid"],
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subcategoryitems",
        as: "subcategoryitems_details",
        let: {
          subcategoryitemsid: "$details.item_category_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$subcategoryitemsid"],
              },
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "$main_category_id",
        categorydetails: { $first: "$category_name" },
        details_data: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 1,
        categorydetails: {
          _id: 1,
          category_name: 1,
        },
        details_data: {
          _id: 1,
          project_id: 1,
          customer_id: 1,
          main_category_id: 1,
          category_name: {
            _id: 1,
            category_name: 1,
          },
          details: {
            sub_category_id: 1,
            item_category_id: 1,
          },
          subcategory_details: {
            _id: 1,
            sub_category_name: 1,
          },
          subcategoryitems_details: {
            _id: 1,
            sub_category_id: 1,
            item_name: 1,
          },
        },
      },
    },
  ])
    .then((projectmaindetails) =>
      res.send({
        status: 1,
        data: projectmaindetails,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//UPDATE PROJECT MAIN BASED ON ID
router.put("/updateprojectmain/:id", async (req, res) => {
  const projectmainupdate = await ProjectMain.findByIdAndUpdate(
    req.params.id,
    {
      detailname: req.body.detailname,
      itemcode: req.body.itemcode,
      volume: req.body.volume,
      photolink: req.body.image,
      remarks: req.body.remarks,
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!projectmainupdate)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmainupdate,
  });
});

//DELETE A PROJECT MAIN
router.delete("/deleteprojectmain/:id", async (req, res) => {
  const projectmaindelete = await ProjectMain.findByIdAndRemove(req.params.id);
  if (!projectmaindelete)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmaindelete,
  });
});

module.exports = router;
