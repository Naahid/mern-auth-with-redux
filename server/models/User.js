const mongoose = require("mongoose");

// Create Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

const User = mongoose.model('user', UserSchema);
module.exports = User;