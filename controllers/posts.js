///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")


//Index:
const index = async (req, res) => {
    const posts = await Post.find({})
    res.render("posts/index", {posts})
}



///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    index
}