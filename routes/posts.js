///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const postsController = require("../controllers/posts")
const User = require("../models/User")

///////////////////////////////
// Custom Middleware Functions
////////////////////////////////
//Add current user to req.user
const addUser = async (req, res, next) => {
    if(req.session.userId) {
        req.user = await User.findById(req.session.userId)
        next()
    } else {
        next()
    }
}

//Check for authorization
const isAuthorized = (req, res, next) => {
    //check if user logged in
    if (req.user) {
        next()
    } else {
        res.redirect("back")
    }
}


///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(addUser)

///////////////////////////////
// Router Routes
////////////////////////////////

//Index:
router.get("/", isAuthorized, postsController.index)

//Delete:
router.delete("/:id", isAuthorized, postsController.destroy)

//Update:
router.put("/:id", isAuthorized, postsController.update)

//Create:
router.post("/", isAuthorized, postsController.create)

//Edit:
router.get("/:id/edit", isAuthorized, postsController.edit)

//Show:
router.get("/:id", isAuthorized, postsController.show)



///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router