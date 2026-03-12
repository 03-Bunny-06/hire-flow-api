const mongoose = require("mongoose")

const bookmarksSchema = new mongoose.Schema({
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
    savedAt: {
        type: Date,
        default: Date.now
    }
})

const Bookmarks = mongoose.model('Bookmarks', bookmarksSchema)

module.exports = Bookmarks;