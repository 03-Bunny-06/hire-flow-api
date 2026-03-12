const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type:String,
        required: true
    },
    educationDetails: {
        type: String,
        required: true
    },
    yearOfGraduation: {
        type: Number,
        required: true
    },
    skills: [
        {type: String}
    ],
    resumeLink: {
        type: String,
        required: true
    },
    gitHubLink: String,
    linkedinLink: String
})

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;