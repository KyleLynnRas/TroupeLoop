///////////////////////////////
// Imports
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

//New user:
const newUser = (req, res) => {
    res.render("users/signup")
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


///////////////////////////////
// Exports
////////////////////////////////
module.exports = {
    new: newUser, 
    signUp,
    logIn,
    logOut
}