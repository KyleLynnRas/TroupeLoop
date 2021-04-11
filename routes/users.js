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

//Signup: 
router.get("/signup", userController.new)

router.post("/signup", userController.signUp)

//Login:
router.get("/login", userController.logInForm)

router.post("/login", userController.logIn)

//Logout: 
router.get("/logout", userController.logOut)

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router