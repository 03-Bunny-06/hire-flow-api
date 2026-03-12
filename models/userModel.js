const mongoose = require("mongoose");

const roles = ['applicant', 'recruiter']
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: roles,
        required: true
    },
    isProfileCreated: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;