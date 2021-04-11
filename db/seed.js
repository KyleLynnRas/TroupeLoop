// import the database connection
const mongoose = require("./connection")

//////////////////////////////////
// Models
/////////////////////////////////
const Post = require("../models/Post")

/////////////////////////////////
// Seed
/////////////////////////////////
const seed = async () => {
    await Post.deleteMany({})
    //posts to seed 
    const newPosts = [
        {
            title: "Practices",
            text: "Information on our upcomming practices"
        },
        {
            title: "Shows",
            text: "Information on our upcomming shows"
        },
        {
            title: "Rideshare",
            text: "Information on our rideshares"
        }
    ]
    //create posts
    const posts = await Post.create(newPosts)
    console.log(posts)
}


// run seed function
seed()