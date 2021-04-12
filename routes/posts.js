///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const postsController = require("../controllers/posts")

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

//Index:
router.get("/", postsController.index)

//Delete:
router.delete("/:id", postsController.destroy)

//Update:
router.put("/:id", postsController.update)

//Create:
router.post("/", postsController.create)

//Edit:
router.get("/:id/edit", postsController.edit)

//Show:
router.get("/:id", postsController.show)



///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router