const express = require('express');
const router = express.Router();


const Category=require("../../models/category")


router.post("/add-category",  async (req, res) => {
  try {
    const category = new Category({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,

    });

    await category.save();

    req.session.message = {
      type: "success",
      message: "category added successfully!",
    };
    res.redirect("/categories");

  } catch (err) {
    // Send an error response if something goes wrong
    res.json({ message: err.message, type: "danger" });
  }
});


router.get("/add-category", async(req, res) => {


    res.render("backend/add-category",{
        title:"category Page",
    });
});



router.get('/categories', async (req, res) => {
    const categories = await Category.find().exec(); // Corrected syntax

    try {
        res.render('backend/categories', {title: 'category List',categories:categories  });
    } catch (error) {
        res.status(500).send('Error fetching categorys');
    }
});




router.get('/edit-category/:id', async function (req, res) {
  try {
      const category = await Category.findById(req.params.id).exec();
      if (!category) {
          return res.redirect('/category/pages/');
      }

      res.render('backend/edit-category', {
          title: category.title,
          content: category.content,
          category: category.category,
          id: category._id,
          category:category,

          title:"edit_category",

          message: "category updated successfully",

      });

  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});



router.post('/edit-category/:id', async function (req, res) {
  var id = req.params.id;

   var  { title, content, category, } = req.body;

  try {
      let result = await Category.findByIdAndUpdate(id, {

          title:title,
          content:content,
          category:category,



      });

      if (!result) {
          res.json({ message: "category not found", type: "danger" });
      } else {
          req.session.message = {
              type: "success",
              message: "category updated successfully"
          };
              res.redirect('/categories');
      }
  } catch (err) {
      res.json({ message: err.message, type: "danger" });
  }
});





router.get('/delete-category/:id', async function (req, res) {
  try {
      await Category.findByIdAndDelete(req.params.id);
      const category = await Category.find({}).sort({ sorting: 1 }).exec();
      req.app.locals.categorys = category;
   {
          req.session.message = {
              type: "success",
              message: "category Delete successfully"
          };


          res.redirect("/categories");
      }
  } catch (err) {
      console.error(err);
  }
});


module.exports = router;
