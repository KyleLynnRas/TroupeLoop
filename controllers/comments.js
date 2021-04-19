///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")
//dayjs
var dayjs = require("dayjs")

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
        // console.log(postId)
        relPost.comments.pull(currentComment.id)
        relPost.save()

        //Delete from all user's fav list in db
        const allUsers = await User.find({})
        // console.log(allUsers)
        for (user of allUsers) {
            //find user in db
            user1 = await User.findById(user.id)
            //user's fav post arr
            const favArr = user1.favComments
            for (fav of favArr) {
                // if favPost id matches currPost delete
                if (fav == currentComment.id) {
                    user1.favComments.pull(fav)
                    user1.save()
                }
            }
        }
        //remove comment from db
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
    const currentComment = await Comment.findById(req.params.id).populate("post").populate("author")
    //format date
    console.log(currentComment)
    let postedAt = currentComment.createdAt
    postedAt = dayjs(postedAt).format("MM-DD-YY")
    //nav
    const userNav = req.session.userId
    res.render("comments/edit", {
        comment: currentComment, 
        postDate: postedAt, 
        //nav
        userNav,
        view: "post-other"
    })
}


//Favorite: 
const favorite = async (req, res) => {
    const commentId = req.params.id
    //find in db
    const favComm = await Comment.findById(commentId).populate("post")
    // get currentUser, push post to user db
    const currentUser = await User.findById(req.session.userId)
    currentUser.favComments.push(favComm)
    currentUser.save()
    //postid for redirect 
    const postId = favComm.post.id
    // console.log(currentUser)
    res.redirect(`/posts/${postId}`)
}


///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    create, 
    edit, 
    update,
    destroy, 
    favorite
}