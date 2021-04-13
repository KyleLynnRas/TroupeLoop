///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const commentsController = require("../controllers/comments")

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

//Delete:
router.delete("/:id", commentsController.destroy)

//Update: /comments/commentId
router.put("/:id", commentsController.update)

//Create: /comments/postId
router.post("/:id", commentsController.create)

//Edit: comments/commentId
router.get("/:id/edit", commentsController.edit)

//Show: /comments/commentId
router.get("/:id", commentsController.show)

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router