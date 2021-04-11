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

//Create:
router.post("/", postsController.create)

//Show:
router.get("/:id", postsController.show)



///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router