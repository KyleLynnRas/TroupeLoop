////////////////////////////////
// Imports
////////////////////////////////
const { Schema, model } = require("../db/connection.js")

////////////////////////////////
// Schema
////////////////////////////////
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
  }, { timestamps: true }
)

////////////////////////////////
// Model
////////////////////////////////
const User = model("User", UserSchema)

////////////////////////////////
//  Exports
////////////////////////////////
module.exports = User