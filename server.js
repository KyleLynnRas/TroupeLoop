// grab env variables
require("dotenv").config
// import express
const express = require("express")
// import database connection
const mongoose = require("./db/connection")
// import merced logger
const {log} = require("mercedlogger")
// import middleware
const methodOverride = require("method-override")
const morgan = require("morgan")
const cors = require("cors")
// port
const PORT = process.env.PORT || "2021"
const SECRET = process.env.SECRET || "secret"
const userRouter = require("./routes/users")
const postsRouter = require("./routes/posts")
const commentsRouter = require("./routes/comments")
// Sessions Middleware
const session = require("express-session"); 
const connect = require("connect-mongodb-session")(session) 

//////////////////////////////////
// Create APP Object
///////////////////////////////////
const app = express()


//////////////////////////////////
// Set the View Engine
//////////////////////////////////
app.set("view engine", "ejs")

///////////////////////////////////
// Setup Middleware
///////////////////////////////////
app.use(cors()) // prevent cors errors
app.use(methodOverride("_method")) // swap methods for delete/put requests
app.use(express.static("public")) // serve public folder as static
app.use(morgan("tiny")) // request logging
app.use(express.json()) // parse json bodies
app.use(express.urlencoded({extended: false}))
// Session middleware
app.use(
    session({
      secret: SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      saveUninitialized: true, 
      resave: true, 
      store: new connect({
        uri: process.env.MONGODB_URL,
        databaseName: "sessions",
        collection: "sessions",
      }),
    })
  );

////////////////////////////////
// Routes and Routers
////////////////////////////////

// Main index 
app.get("/", (req, res) => {
    res.render("index")
})

//userRouter
app.use("/user", userRouter);

//postsRouter
app.use("/posts", postsRouter);

//commentsRouter
app.use("/comments", commentsRouter)

///////////////////////////////////
// App Listener
//////////////////////////////////
app.listen(PORT, () => log.white("🚀 Server Launch 🚀", `Listening on port ${PORT}`))