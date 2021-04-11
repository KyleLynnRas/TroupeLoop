///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

//Signup: 
router.get("/signup", (req, res) => {
    res.render("users/signup")
})

router.post("/signup", async (req, res) => {
    try {
        console.log(req.body)
        // salt password
        const salt = await bcrypt.genSalt(10)
        //hash password
        req.body.password = await bcrypt.hash(req.body.password, salt)
        // new user from user model
        const newUser = await User.create(req.body)
        console.log(newUser)
        //main index 
       res.redirect("/")
    } catch (error) {
        res.json(error)
    }
})

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router