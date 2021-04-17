///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const userController = require("../controllers/users")

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

// Main index 
router.get("/", (req, res) => {
    //user 
    const userNav = req.session.userId
    res.render("index", { userNav, view: "main-idx" })
})

//Signup: 
router.get("/user/signup", userController.new)

router.post("/user/signup", userController.signUp)

//Login:
router.post("/", userController.logIn)

//Logout: 
router.get("/user/logout", userController.logOut)

//Show:
router.get("/user/:id", userController.show)

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router