///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

//Index:
const index = async (req, res) => {
    const posts = await Post.find({}).populate("author")
    res.render("posts/index", {
        posts
    })
}

//Create:
const create = async (req, res) => {
    const newPost = await Post.create(req.body)
    //current user
    const currentUser = await User.findById(req.session.userId)
    // console.log(currentUser)
    //update new post with user info
    newPost.author.push(currentUser)
    newPost.save()
    // console.log(newPost)
    res.redirect("/posts")
}

//Show: 
const show = async (req, res) => {
    const currentPost = await Post.findById(req.params.id)
    res.render("posts/show", {
        post: currentPost
    })
}

///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    index, 
    create, 
    show
}