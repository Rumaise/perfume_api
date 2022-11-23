const express = require("express");
const project = require("../models/project");
const router = express.Router();
const { Project, validateProject } = require("../models/project");
const { Process } = require("../models/process");

//POST : CREATE A NEW PROJECT

router.post("/createproject", async (req, res) => {
  const error = await validateProject(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var project = new Project({
    customer_id: req.body.customer_id,
    referrence: req.body.referrence,
    brandname: req.body.brandname,
    productname: req.body.productname,
    producttype: req.body.producttype,
    variantname: req.body.variantname,
    completed: req.body.completed,
    categories_added: req.body.categories_added,
    quantity: req.body.quantity,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  project
    .save()
    .then((project) => {
      res.send({
        status: 1,
        data: project,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECTS
router.get("/projectslist", (req, res) => {
  Project.find({ completed: false })
    .then((project) =>
      res.send({
        status: 1,
        data: project,
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
router.get("/projectslistcount", (req, res) => {
  Project.find({ completed: false })
    .count()
    .then((project) =>
      res.send({
        status: 1,
        data: project,
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
router.get(
  "/projectslistcountbyfromandtodate/:from/:to/:status",
  (req, res) => {
    console.log(req.params.from);
    console.log(req.params.to);
    Project.aggregate([
      {
        $match: {
          completed: req.params.status === "true" ? true : false,
          handover_datetime: { $exists: true },
        },
      },
      {
        $project: {
          _id: 1,
          formattedDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$handover_datetime",
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
        $count: "totalcount",
      },
    ])
      .then((project) =>
        res.send({
          status: 1,
          data: project,
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

router.get("/totalprojectscount", (req, res) => {
  Project.estimatedDocumentCount()
    .then((count) =>
      res.send({
        status: 1,
        data: count,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/projectslistcountbyyearormonthwise/:year/:status", (req, res) => {
  Project.aggregate([
    {
      $match: {
        completed: req.params.status === "true" ? true : false,
        start_datetime: { $exists: true },
      },
    },
    {
      $project: {
        _id: 1,
        formattedDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$start_datetime",
          },
        },
        formattedYear: {
          $dateToString: {
            format: "%Y",
            date: "$start_datetime",
          },
        },
      },
    },
    {
      $match: {
        formattedYear: req.params.year,
      },
    },
    {
      $group: {
        _id: {
          $month: { $dateFromString: { dateString: "$formattedDate" } },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        formattedYear: 1,
        total: 1,
      },
    },
  ])
    .then((project) =>
      res.send({
        status: 1,
        data: project,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/projectscompletestatusgraph", (req, res) => {
  Project.aggregate([
    {
      $match: {
        completed: true,
        completed_date: { $exists: true },
        start_datetime: { $exists: true },
        handover_datetime: { $exists: true },
      },
    },
    {
      $project: {
        _id: 1,
        referrence: 1,
        productname: 1,
        formatted_completed_date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$completed_date",
          },
        },
        formatted_handover_datetime: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$handover_datetime",
          },
        },
      },
    },
    {
      $addFields: {
        convert_handover_datetime: {
          $dateFromString: {
            dateString: "$formatted_handover_datetime",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $addFields: {
        convert_completed_date: {
          $dateFromString: {
            dateString: "$formatted_completed_date",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        referrence: 1,
        productname: 1,
        formatted_completed_date: 1,
        formatted_handover_datetime: 1,
        convert_handover_datetime: 1,
        convert_completed_date: 1,
        day: {
          $trunc: {
            $divide: [
              {
                $subtract: [
                  "$convert_handover_datetime",
                  "$convert_completed_date",
                ],
              },
              86400000,
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        projects_details: {
          $push: "$$ROOT",
        },
        early: { $sum: { $cond: [{ $gt: ["$day", 0] }, 1, 0] } },
        late: { $sum: { $cond: [{ $lt: ["$day", 0] }, 1, 0] } },
        ontime: { $sum: { $cond: [{ $eq: ["$day", 0] }, 1, 0] } },
      },
    },
  ])
    .then((project) =>
      res.send({
        status: 1,
        data: project,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get(
  "/projectslistbypaginate/:status/:page/:count/:term?",
  (req, res) => {
    if (req.params.term) {
      console.log("Terms are not null");
      Project.aggregatePaginate(
        Project.aggregate([
          {
            $match: { completed: req.params.status === "true" ? true : false },
          },
          {
            $lookup: {
              from: "customers",
              as: "customerdetails",
              let: { customer_id: "$customer_id" },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$customer_id"] } },
                },
                {
                  $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    phone: 1,
                    email: 1,
                    companyname: 1,
                    trn: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$customerdetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  "customerdetails.firstname": {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
                {
                  "customerdetails.lastname": {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
                {
                  "customerdetails.email": {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
                {
                  "customerdetails.phone": {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
                {
                  referrence: {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
                {
                  brandname: {
                    $regex: ".*" + req.params.term + ".*",
                    $options: "i",
                  },
                },
              ],
            },
          },
          {
            $sort: { created_date: -1 },
          },
        ]),
        { page: req.params.page, limit: req.params.count }
      )
        .then((projects) =>
          res.send({
            status: 1,
            data: projects,
          })
        )
        .catch((error) => {
          res.status(500).send({
            status: 0,
            data: error.message,
          });
        });
    } else {
      console.log("Null terms");
      console.log(req.params.status);

      Project.aggregatePaginate(
        Project.aggregate([
          {
            $match: { completed: req.params.status === "true" ? true : false },
          },
          {
            $lookup: {
              from: "customers",
              as: "customerdetails",
              let: { customer_id: "$customer_id" },
              pipeline: [
                {
                  $match: { $expr: { $eq: ["$_id", "$$customer_id"] } },
                },
                {
                  $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    phone: 1,
                    email: 1,
                    companyname: 1,
                    trn: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$customerdetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { created_date: -1 },
          },
        ]),
        { page: req.params.page, limit: req.params.count }
      )
        .then((projects) =>
          res.send({
            status: 1,
            data: projects,
          })
        )
        .catch((error) => {
          res.status(500).send({
            status: 0,
            data: error.message,
          });
        });
    }
  }
);

//GET THE PROJECT DETAILS ALONG WITH CUSTOMER DETAILS
// GET ALL RECORDS JOINED
router.get("/loadallprojectwithcustomerdetails", (req, res) => {
  Project.aggregate([
    {
      $lookup: {
        from: "customers",
        as: "customerdetails",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$customer_id"] } },
          },
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              phone: 1,
              email: 1,
              companyname: 1,
              trn: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$customerdetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   // $project: {
    //   //   _id: 1,
    //   //   customer_id: 1,
    //   //   referrence: 1,
    //   //   brandname: 1,
    //   //   productname: 1,
    //   //   producttype: 1,
    //   //   variantname: 1,
    //   //   customerdetails: 1,
    //   // },
    // },
  ])
    .then((projects) =>
      res.send({
        status: 1,
        data: projects,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE PROJECT BY ID
router.get("/project/:id", async (req, res) => {
  const projectdetails = await Project.findById(req.params.id);
  if (!projectdetails)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectdetails,
  });
});

//UPDATE PROJECT BASED ON ID
router.put("/updateproject/:id", async (req, res) => {
  const projectupdate = await Project.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      completed: req.body.completed,
      completed_date: Date.now(),
      // $push: { categories_added: req.body.category_id },
    },
    { new: true }
  );
  if (!projectupdate)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectupdate,
  });
});

router.put("/updateprojectstartdate/:id", async (req, res) => {
  const projectupdate = await Project.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      start_datetime: req.body.start_datetime,
    },
    { new: true }
  );
  if (!projectupdate)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectupdate,
  });
});

router.put("/updateprojecthandoverdate/:id", async (req, res) => {
  const projectupdate = await Project.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      handover_datetime: req.body.handover_datetime,
    },
    { new: true }
  );
  if (!projectupdate)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectupdate,
  });
});

router.put("/updateprojectapproveddatetime/:id", async (req, res) => {
  const projectupdate = await Project.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      approved_datetime: req.body.approved_datetime,
    },
    { new: true }
  );
  if (!projectupdate)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectupdate,
  });
});

//DELETE A PROJECT
router.delete("/deleteproject/:id", async (req, res) => {
  const projectdelete = await Project.findByIdAndRemove(req.params.id);
  if (!projectdelete)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectdelete,
  });
});

module.exports = router;
