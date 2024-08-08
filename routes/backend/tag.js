const express = require('express');
const router = express.Router();


const Tag=require("../../models/tag")


router.post("/add-tag",  async (req, res) => {
  try {
    const tag = new Tag({
      slug: req.body.slug,
      name: req.body.name,
      content: req.body.content,
      category: req.body.category,

    });

    await tag.save();

    req.session.message = {
      type: "success",
      message: "tag added successfully!",
    };
    res.redirect("/tags");

  } catch (err) {
    // Send an error response if something goes wrong
    res.json({ message: err.message, type: "danger" });
  }
});


router.get("/add-tag", async(req, res) => {


    res.render("backend/add-tag",{
        title:"tag Page",
    });
});



router.get('/tags', async (req, res) => {
    const tags = await Tag.find().exec(); // Corrected syntax

    try {
        res.render('backend/tags', {title: 'tag List',tags:tags  });
    } catch (error) {
        res.status(500).send('Error fetching tags');
    }
});




router.get('/edit-tag/:id', async function (req, res) {
  try {
      const tag = await Tag.findById(req.params.id).exec();
      if (!tag) {
          return res.redirect('/tag/pages/');
      }

      res.render('backend/edit-tag', {
          slug: tag.slug,
          name: name.slug,
          content: tag.content,
          category: tag.category,
          id: tag._id,
          tag:tag,

          title:"edit_tag",

          message: "tag updated successfully",

      });

  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});



router.post('/edit-tag/:id', async function (req, res) {
  var id = req.params.id;

   var  { slug, content, category,name } = req.body;

  try {
      let result = await Tag.findByIdAndUpdate(id, {

          slug:slug,
          name:name,
          content:content,
          category:category,



      });

      if (!result) {
          res.json({ message: "tag not found", type: "danger" });
      } else {
          req.session.message = {
              type: "success",
              message: "tag updated successfully"
          };
              res.redirect('/tags');
      }
  } catch (err) {
      res.json({ message: err.message, type: "danger" });
  }
});





router.get('/delete-tag/:id', async function (req, res) {
  try {
      await Tag.findByIdAndDelete(req.params.id);
      const tag = await Tag.find({}).sort({ sorting: 1 }).exec();
      req.app.locals.tags = tag;
   {
          req.session.message = {
              type: "success",
              message: "tag Delete successfully"
          };


          res.redirect("/tags");
      }
  } catch (err) {
      console.error(err);
  }
});


module.exports = router;
