const express = require('express');
const router = express.Router();
const Post = require("../../models/post");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}); // Fetch data from the backend (e.g., posts)
        
        // Pass fetched data to the template
        res.render("frontend/home", { posts });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data");
    }
});

module.exports = router;
