const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email: {type : String, Unique: true},
    password: String
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = {
    UserModel
}