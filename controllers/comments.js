///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")


//Update:
const update = async (req, res) => {
    //update comment
    await Comment.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.redirect(`/comments/${req.params.id}`)
}

//Create: 
const create = async (req, res) => {
    //create new comment
    const newComment = await Comment.create(req.body)
    //current post
    const currentPost = await Post.findById(req.params.id)
    //current user
    const user = await User.findById(req.session.userId)
    //add currentpost to newcomment 
    newComment.post = currentPost
    //add currentuser to newcomment 
    newComment.author = user
    newComment.save()
    console.log(newComment)
    //push newcomment to user 
    user.comments.push(newComment)
    user.save()
    //push newcomment to post
    currentPost.comments.push(newComment)
    currentPost.save()
    //id for redirect 
    const postId = req.params.id
    //post show view
    res.redirect(`/posts/${postId}`)
}

//Edit: 
const edit = async (req, res) => {
    const currentComment = await Comment.findById(req.params.id).populate("post")
    res.render("comments/edit", {
        comment: currentComment
    })
}

//Show: 
const show = async (req, res) => { 
    // console.log(req.params)
    commentId = req.params.id
    const currentComment = await Comment.findById(commentId).populate("post").populate("author")
    //get currentPost id for url
    const postId = currentComment.post.id
    res.render("comments/show", {
        comment: currentComment, 
        postId
    })
}


///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    create, 
    show, 
    edit, 
    update
}