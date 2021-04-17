///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")
//dayjs
var dayjs = require("dayjs")

//Index:
const index = async (req, res) => {
    const posts = await Post.find({}).populate("author")
    //new array with post info for index view 
    let postArr = []
    for (post of posts) {
        //set date format and add to array
        let postDate = dayjs(post.createdAt).format("MM-DD-YY")
        let postObj = { title: post.title, text: post.text, author: post.author.username, date: postDate, id: post.id}
        postArr.push(postObj)
    }
    const currentUser = req.session.userId
    // console.log(postArr)
    res.render("posts/index", {
        posts: postArr,
        user: currentUser,
        //nav bar
        view: "post-index", 
        userNav: currentUser
    })
}

//Delete:
const destroy = async (req, res) => {
    try {
        const currentPost = await Post.findById(req.params.id).populate("comments").populate("author")
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
        //remove currentpost from user
        const userID = currentPost.author.id
        const currentUser = await User.findById(userID)
        currentUser.posts.pull(currentPost.id)
        currentUser.save()
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
    //add post to currentUser in db
    currentUser.posts.push(newPost)
    currentUser.save()
    // console.log(newPost)
    res.redirect("/posts")
}

//Edit:
const edit = async (req, res) => {
    //get current post
    const currentPost = await Post.findById(req.params.id).populate("author")
    //format date
    let postedAt = currentPost.createdAt
    postedAt = dayjs(postedAt).format("MM-DD-YY")
    //user for nav
    const currentUser = req.session.userId
    res.render("posts/edit", {
        post: currentPost, 
        postDate: postedAt,
        //nav bar
        view: "post-other",
        userNav: currentUser
    })
}

//Show: 
const show = async (req, res) => {
    const currentPost = await Post.findById(req.params.id).populate("comments").populate("author")
    //array of comments for post 
    const currentComments = currentPost.comments
    //get all comments from db, new array with updated info
    let commentsArr = []
    for (comment of currentComments) {
        let dbComm = await Comment.findById(comment.id).populate("author")
        //set date format and add to array
        let dbCommDate = dayjs(comment.createdAt).format("MM-DD-YY")
        let dbCommObj = {text: dbComm.text, author: dbComm.author.username, authID: dbComm.author.id, date: dbCommDate, id: comment.id}
        // console.log(dbCommObj)
        commentsArr.push(dbCommObj)
    }
    // console.log(commentsArr)
    //format post date 
    let postedAt = currentPost.createdAt
    postedAt = dayjs(postedAt).format("MM-DD-YY")
    //current user for auth
    const currentUser = req.session.userId
    res.render("posts/show", {
        post: currentPost,
        postDate: postedAt,
        comments: commentsArr, 
        currentUser, 
        //nav bar 
        view: "post-other", 
        userNav: currentUser
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