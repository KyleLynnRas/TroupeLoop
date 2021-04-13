///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")

//Index:
const index = async (req, res) => {
    const posts = await Post.find({}).populate("author")
    res.render("posts/index", {
        posts
    })
}

//Delete:
const destroy = async (req, res) => {
    try {
        const currentPost = await Post.findById(req.params.id).populate("comments")
        //delete all realted comments from db 
        const relComments = currentPost.comments
        // console.log(relComments)
        for (comment of relComments) {
            //id of comment
            const commentId = comment.id
            //find currentcomment 
            const currentComment = await Comment.findById(commentId).populate("author")
            //find user in currentComment
            const commentUserId = currentComment.author.id
            const commentUser = await User.findById(commentUserId)
            //remove currentcomment from user
            commentUser.comments.pull(currentComment.id)
            commentUser.save()
            //delete comment from db
            await Comment.findByIdAndRemove(commentId)
        }
        //delet post from db
        await Post.findByIdAndRemove(req.params.id)
        res.redirect("/posts")
    } catch (error) {
        res.json(error)
    }
}

//Update: 
const update = async (req, res) => {
    const postId = req.params.id
    //get current post
    await Post.findByIdAndUpdate(postId, req.body, {new: true})
    res.redirect("/posts")
}

//Create:
const create = async (req, res) => {
    const newPost = await Post.create(req.body)
    //current user
    const currentUser = await User.findById(req.session.userId)
    // console.log(currentUser)
    //update new post with user info
    newPost.author = currentUser
    newPost.save()
    // console.log(newPost)
    res.redirect("/posts")
}

//Edit:
const edit = async (req, res) => {
    //get current post
    const currentPost = await Post.findById(req.params.id)
    res.render("posts/edit", {
        post: currentPost
    })
}

//Show: 
const show = async (req, res) => {
    const currentPost = await Post.findById(req.params.id).populate("comments").populate("author")
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
    show,
    destroy, 
    edit,
    update
}