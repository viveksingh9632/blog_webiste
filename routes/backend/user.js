


const express = require('express');
const router = express.Router();
const passport = require('passport');
const setUser = require('../../middlewares/auth'); // Adjust the path as necessary

// Use the setUser middleware
router.use(setUser);

const User=require("../../models/users")
const Tag=require("../../models/tag")


router.post("/add_User" ,async (req, res) => {
    try {


        async function checkEmailExists(email) {
            const user = await User.findOne({ email });
            return !!user; // If user exists, return true; otherwise, return false
        }

        // Check if the email already exists
        const emailExists = await checkEmailExists(req.body.email);

        if (emailExists) {
            req.session.message = {
                type: "danger",
                message: "Admin email already exists."
            };
            return res.redirect("/add_user");
        }
        
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            tag_id: req.body.tag_id,
            password: req.body.password,
                   
        
        });

        // Save the new User to the database
        await user.save();
        console.log(user)

        // Set a success message in the session and redirect
        req.session.message = {
            type: "success",
            message: "User added successfully!"
          };
        res.redirect("/users");

    } catch (err) {
        // Send an error response if something goes wrong
        res.json({ message: err.message, type: "danger" });
    }
});

router.get('/users', async (req, res) => {
    try {
        console.log("Received request to /users"); // Log request received
        const users = await User.find().populate('tag_id').exec();
        console.log("Fetched users from database:", users); // Log fetched users
        res.render('backend/users', {
            title: 'User List',
            users: users // Pass users data to template
        });
    } catch (error) {
        console.error("Error fetching users:", error); // Log error
        res.status(500).send('Error fetching users');
    }
});





router.get("/add_user", async (req, res) => {
    try {
        console.log("Received request to /add_user"); // Log request received
        const tags = await Tag.find();
        console.log("Tags fetched from database:", tags); // Log fetched tags
        res.render("backend/add_user", {
            title: "User Page",
            tags: tags // Pass tags data to template
        });
    } catch (error) {
        console.error("Error fetching tags:", error); // Log error
        res.status(500).send("Error fetching tags: " + error);
    }
});


router.get('/edit_user/:id', async function (req, res) {
    try {
        const user = await User.findById(req.params.id).exec();
        const tags = await Tag.find({}); // Fetch categories

        if (!user) {
            return res.redirect('/user/pages/');
        }

        
        res.render('backend/edit_user', {
            name: user.name,
            password: user.password,
            email: user.email,
            id: user._id,
            user:user,
            tags,
            title:"edit_user",
            message: "user updated successfully",

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/edit_user/:id', async function (req, res) {
    var id = req.params.id;

     var  { name, password, email, } = req.body;

    try {
        let result = await User.findByIdAndUpdate(id, {
            name: name,
            email: email,
            password:password,



        });

        if (!result) {
            res.json({ message: "user not found", type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "user updated successfully"
            };
                res.redirect('/users');
        }
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});





router.get('/delete_user/:id', async function (req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        const user = await User.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.users = user;
     {
            req.session.message = {
                type: "success",
                message: "user Delete successfully"
            };


            res.redirect("/users");
        }
    } catch (err) {
        console.error(err);
    }
});


// router.get('/dashboard',(req,res)=>{
    // const message = req.session.message;
  
    //  console.log(message)
    //   req.session.message = "";
    
    
//      res.render('backend/dashboard' ,{message,title:"yes"})
//   });
  
  router.get('/dashboard', async (req, res) => {
    const message = req.session.message;
  
    console.log(message)
     req.session.message = "";

    if (req.user) {  // assuming req.user holds the logged-in user's token information
      // Fetch the full user object from the database using the user ID from the token
      const fullUser = await User.findById(req.user._id);
      if (fullUser) {
        res.locals.user = fullUser;
      } else {
        console.log('User not found in the database');
      }
    }
    res.render('backend/dashboard' ,{message,title:"yes"});  // 'home' should be the name of your EJS file
  });
  



router.get("/login", (req, res) => {
    const message = req.session.message;
  
    req.session.message = "";
    console.log(message);
  
    res.render("backend/login", { title: "Login Users", message, });
  });
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));
  
  // Logout route
  router.get('/logout', (req, res) => {
    // Destroy the user session with a callback function
    req.logout(() => {
        // After logout, redirect the user to the login page or any other desired page
        res.redirect('/login'); // Redirect to the login page
    });
  });
  
  
  
  
  
  
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
  }
    


module.exports = router;


