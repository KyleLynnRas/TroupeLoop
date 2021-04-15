///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")

//Delete:
const destroy = async (req, res) => {
    try {
        const currentComment = await Comment.findById(req.params.id).populate("post").populate("author")
        //get objId of related user (author)
        const userID= currentComment.author.id
        //delete currentcomment from relUser in db
        const relUser = await User.findById(userID)
        // console.log(relUser)
        relUser.comments.pull(currentComment.id)
        relUser.save()
        //get objId of related post
        const postId = currentComment.post.id
        //delete currentcomment from relPost in db
        const relPost = await Post.findById(postId)
        console.log(postId)
        relPost.comments.pull(currentComment.id)
        relPost.save()
        //remove comment
        await Comment.findByIdAndRemove(req.params.id)
        res.redirect(`/posts/${postId}`)
    } catch (error) {
        res.json(error)
    }
}

//Update:
const update = async (req, res) => {
    //update comment
    await Comment.findByIdAndUpdate(req.params.id, req.body, {new:true})
    const currComm = await Comment.findById(req.params.id)
    // console.log(currComm.post)
    const postId = currComm.post
    res.redirect(`/posts/${postId}`)
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
    update,
    destroy
}