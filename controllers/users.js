///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
//dayjs
var dayjs = require("dayjs")

//New user:
const newUser = (req, res) => {
    //nav
    const userNav = req.session.userId
    res.render("users/signup", {
        userNav, 
        view: "sign-up"
    })
}

//Signup/create new user:
const signUp = async (req, res) => {
    try {
        // console.log(req.body)
        // salt password
        const salt = await bcrypt.genSalt(10)
        //hash password
        req.body.password = await bcrypt.hash(req.body.password, salt)
        // new user from user model
        const newUser = await User.create(req.body)
        // console.log(newUser)
        //main index 
       res.redirect("/")
    } catch (error) {
        res.json(error)
    }
}

//Login:
const logIn = async (req, res) => {
    try {
        //check for user in db
        const user = await User.findOne({username: req.body.username})
        //if exist
        if(user) {
            //password verification
            const result = await bcrypt.compare(req.body.password, user.password)
            //if matches:
            if(result) {
                //create session
                req.session.userId = user._id
                // console.log(req.session.userId)
                res.redirect("/posts")
            } else {
                //error 
                res.json({error: "Password incorrect"})
            }
        //user doesn't exist
        } else {
            res.json({error: "Unknown user"})
        } 
    } catch (error) {
        res.json(error)
    }
}

//Logout:
const logOut = (req, res) => {
    req.session.userId = null
    console.log(req.session)
    res.redirect("/")
}

//Show: 
const show = async (req, res) => {
    const userID = req.params.id
    const currentUser = await User.findById(userID).populate("posts").populate("comments").populate("favPosts").populate("favComments")
    //User favComments into array to reformat date
    const favCommsArr = currentUser.favComments
    let favComms = []
    for (let comment of favCommsArr) {
        let dbComm = await Comment.findById(comment.id).populate("author").populate("post")
        // date format
        let dbCommDate = dayjs(comment.createdAt).format("MM-DD-YY")
        let dbCommObj = {text: dbComm.text, author: dbComm.author.username, date: dbCommDate, id: dbComm.id, postId: dbComm.post.id, postTitle: dbComm.post.title}
        // console.log(dbCommObj.author, dbCommObj.postId)
        favComms.push(dbCommObj)
        // console.log(favComms)
    }
    //User favposts into array to reformat date 
    const favPostsArr = currentUser.favPosts
    let favPosts = []
    for (post of favPostsArr) {
        //pop post with author info 
        let dbPost = await Post.findById(post.id).populate("author")
        // date format
        let dbPostDate = dayjs(post.createdAt).format("MM-DD-YY")
        let dbPostObj = {title: dbPost.title, text: dbPost.text, author: dbPost.author.username, date: dbPostDate, id: dbPost.id}
        favPosts.push(dbPostObj)
    }
    // console.log(favPosts)
    res.render("users/show", {
        comments: favComms,
        user: currentUser,
        posts: favPosts, 
        view: "user-show", 
        userNav: userID
    })
}


///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    new: newUser, 
    signUp,
    logIn,
    logOut,
    show
}