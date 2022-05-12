const express = require("express");
const subcategory = require("../models/subcategory");
const router = express.Router();
const { SubCategory, validateSubCategory } = require("../models/subcategory");

//POST : CREATE A NEW  SUB CATEGORY
router.post("/createsubcategory", async (req, res) => {
  const error = await validateSubCategory(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var subcategory = new SubCategory({
    category_id: req.body.category_id,
    sub_category_name: req.body.sub_category_name,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  subcategory
    .save()
    .then((subcategory) => {
      res.send({
        status: 1,
        data: subcategory,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL SUB CATEGORIES

router.get("/subcategorylist", (req, res) => {
  SubCategory.find()
    .then((subcategory) =>
      res.send({
        status: 1,
        data: subcategory,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE SUB CATEGORY BY ID
router.get("/:id", async (req, res) => {
  const subcategorydetails = await SubCategory.findById(req.params.id);
  if (!subcategorydetails)
    res.status(404).send({
      status: 0,
      data: "Sub Category Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategorydetails,
  });
});

//UPDATE SUB CATEGORY BASED ON ID
router.put("/:id", async (req, res) => {
  const subcategoryupdate = await SubCategory.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!subcategoryupdate)
    res.status(404).send({
      status: 0,
      data: "Sub Category Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategoryupdate,
  });
});

//DELETE A SUB CATEGORY
router.delete("/:id", async (req, res) => {
  const subcategorydelete = await SubCategory.findByIdAndRemove(req.params.id);
  if (!subcategorydelete)
    res.status(404).send({
      status: 0,
      data: "Sub Category Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategorydelete,
  });
});

module.exports = router;
