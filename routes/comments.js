///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const commentsController = require("../controllers/comments")
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

//Delete:
router.delete("/:id", isAuthorized, commentsController.destroy)

//Update: /comments/commentId
router.put("/:id", isAuthorized, commentsController.update)

//Create: /comments/postId
router.post("/:id", isAuthorized, commentsController.create)

//Edit: comments/commentId
router.get("/:id/edit", isAuthorized, commentsController.edit)

//Show: /comments/commentId
router.get("/:id", isAuthorized, commentsController.show)

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router