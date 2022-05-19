const express = require("express");
const { default: mongoose } = require("mongoose");
const category = require("../models/category");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");

//POST : CREATE A NEW CATEGORY
router.post("/create", async (req, res) => {
  const error = await validateCategory(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var category = new Category({
    category_name: req.body.category_name,
    textfields: req.body.textfields,
    image: req.body.image,
    remarks: req.body.remarks,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  category
    .save()
    .then((category) => {
      res.send({
        status: 1,
        data: category,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL CATEGORIES

router.get("/list", (req, res) => {
  Category.find()
    .then((category) =>
      res.send({
        status: 1,
        data: category,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

// GET ALL RECORDS JOINED
router.get("/loadallmaster", (req, res) => {
  Category.aggregate([
    {
      $lookup: {
        from: "subcategories",
        as: "subcategory",
        let: { category_id: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$category_id", "$$category_id"] } },
          },
          {
            $lookup: {
              from: "subcategoryitems",
              as: "subcategoryitemslist",
              let: { sub_category_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$sub_category_id", "$$sub_category_id"] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subcategories",
        preserveNullAndEmptyArrays: true,
      },
    },
  ])
    .then((master) =>
      res.send({
        status: 1,
        data: master,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

// GET ALL RECORDS JOINED
router.get("/loadcategorybyid/:id", (req, res) => {
  Category.aggregate([
    {
      $match: { _id: { $eq: mongoose.Types.ObjectId(req.params.id) } },
    },
    {
      $lookup: {
        from: "subcategories",
        as: "subcategory",
        let: { category_id: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$category_id", "$$category_id"] } },
          },
          {
            $lookup: {
              from: "subcategoryitems",
              as: "subcategoryitemslist",
              let: { sub_category_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$sub_category_id", "$$sub_category_id"] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    sub_category_id: 1,
                    item_name: 1,
                  },
                },
                {
                  $addFields: {
                    selected: false,
                  },
                },
              ],
            },
          },

          {
            $project: {
              _id: 1,
              category_id: 1,
              sub_category_name: 1,
              subcategoryitemslist: 1,
            },
          },
          {
            $addFields: {
              expand: false,
              currentselected: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        category_name: 1,
        textfields: 1,
        image: 1,
        remarks: 1,
        subcategory: 1,
      },
    },

    {
      $unwind: {
        path: "$subcategories",
        preserveNullAndEmptyArrays: true,
      },
    },
  ])
    .then((master) =>
      res.send({
        status: 1,
        data: master,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE CATEGORY BY ID
router.get("/:id", async (req, res) => {
  const categorydetails = await Category.findById(req.params.id);
  if (!categorydetails)
    res.status(404).send({
      status: 0,
      data: "Category Details Not Found",
    });
  res.send({
    status: 1,
    data: categorydetails,
  });
});

//UPDATE CATEGORY BASED ON ID
router.put("/:id", async (req, res) => {
  const categoryupdate = await Category.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!categoryupdate)
    res.status(404).send({
      status: 0,
      data: "Category Details Not Found",
    });
  res.send({
    status: 1,
    data: categoryupdate,
  });
});

//DELETE A CATEGORY
router.delete("/:id", async (req, res) => {
  const categorydelete = await Category.findByIdAndRemove(req.params.id);
  if (!categorydelete)
    res.status(404).send({
      status: 0,
      data: "Category Details Not Found",
    });
  res.send({
    status: 1,
    data: categorydelete,
  });
});

module.exports = router;
