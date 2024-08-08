const express = require("express");
const router = express.Router();
const multer = require("multer");


const User=require("../../models/users")
const Tag=require("../../models/tag")
const Post=require("../../models/post")
const Category=require("../../models/category")

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// Route to add a new post post
router.post("/add-post", upload, async (req, res) => {
  try {
    const post = new Post({
      slug: req.body.slug,
      content: req.body.content,
      image: req.file.filename,
      user_id: req.body.user_id,
      tag_id: req.body.tag_id,
      category_id: req.body.category_id,
    });

    await post.save();

    req.session.message = {
      type: "success",
      message: "post added successfully!",
    };
    res.redirect("/posts");
  } catch (err) {
    res.status(500).json({ message: err.message, type: "danger" });
  }
});

// Route to render the add post page
router.get("/add-post",async (req, res) => {
  try {
    const users = await User.find(); // डेटाबेस से सभी टैग्स को प्राप्त करें
    const tags = await Tag.find(); // डेटाबेस से सभी टैग्स को प्राप्त करें
    const categories = await Category.find(); // डेटाबेस से सभी टैग्स को प्राप्त करें

  res.render("backend/add-post", {
    title: 'Add New Post',
    slug: "Add post",
    users:users,
    tags:tags,
    categories:categories
  });
} catch (error) {
  res.status(500).send("Error fetching tags: " + error);
}

});

// Route to list all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
    .populate('user_id')
    .populate('tag_id')
    .populate('category_id')
    .exec();
      res.render("backend/posts", { title: "Post List", posts: posts });
  } catch (error) {
    res.status(500).send("Error fetching posts");
  }
});



router.get('/edit-post/:id', upload, async function (req, res) {
  try {
      const post = await Post.findById(req.params.id).exec();
      const users = await User.find();
      const tags = await Tag.find();
      const categories = await Category.find();

      if (!post) {
          return res.redirect('/post/pages/');
      }




      res.render('backend/edit-post', {
          slug: post.slug,
          content: post.content,
          image: req.file ? req.file.filename : null,
          id: post._id,
          post: post,
          title: "edit_post",
          message: "post updated successfully",
          users,tags,categories
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/edit-post/:id', upload, async function (req, res) {
  var id = req.params.id;
  var { slug, content,user_id,tag_id,category_id } = req.body;

  try {
      let updatedFields = {
          slug: slug,
          content: content,
          user_id:user_id,
          tag_id:tag_id,
          category_id:category_id
      };

      if (req.file) {
          updatedFields.image = req.file.filename;
      }

      let result = await Post.findByIdAndUpdate(id, updatedFields, { new: true });

      if (!result) {
          res.json({ message: "post not found", type: "danger" });
      } else {
          req.session.message = {
              type: "success",
              message: "post updated successfully"
          };
          res.redirect('/posts');
      }
  } catch (err) {
      res.json({ message: err.message, type: "danger" });
  }
});




router.get('/delete-post/:id', async function (req, res) {
  try {
      await Post.findByIdAndDelete(req.params.id);
      const post = await Post.find({}).sort({ sorting: 1 }).exec();
      req.app.locals.posts = post;
   {
          req.session.message = {
              type: "success",
              message: "post Delete successfully"
          };


          res.redirect("/posts");
      }
  } catch (err) {
      console.error(err);
  }
});
module.exports = router;
