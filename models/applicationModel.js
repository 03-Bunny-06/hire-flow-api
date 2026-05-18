const mongoose = require("mongoose");

const typesOfStatus = ['Hiring In Process', 'Hiring Done', 'Selected', 'Rejected']
const applicationSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    resumeUsed: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: typesOfStatus,
        default: typesOfStatus[0],
        required: true
    }
}, {timestamps: true})

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application;