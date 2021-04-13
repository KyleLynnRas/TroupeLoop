///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")



//Create: 
const create = async (req, res) => {
    //create new comment
    const newComment = await Comment.create(req.body)
    //current post
    const currentPost = await Post.findById(req.params.id)
    //current user
    const user = await User.findById(req.session.userId)
    //push post to new comment model 
    newComment.post.push(currentPost)
    //push current user to new comment model
    newComment.author.push(user)
    newComment.save()
    //push newcomment to user model 
    user.comments.push(newComment)
    user.save()
    //push newcomment to post model
    currentPost.comments.push(newComment)
    currentPost.save()
    //id for redirect 
    const postId = req.params.id
    //post show view
    res.redirect(`/posts/${postId}`)
}




///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    create
}