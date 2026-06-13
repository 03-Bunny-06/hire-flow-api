const mongoose = require("mongoose");
const { email } = require("zod");
const { required } = require("zod/mini");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;