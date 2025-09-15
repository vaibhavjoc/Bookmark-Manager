const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email: {type : String, Unique: true},
    password: String
})

const BookmarkSchema = new Schema({
    title: String,
    userId: ObjectId
})

const UserModel = mongoose.model("users", UserSchema);
const BookmarkMOdel = mongoose.model("bookmarks", BookmarkSchema)

module.exports = {
    UserModel,
    BookmarkMOdel
}