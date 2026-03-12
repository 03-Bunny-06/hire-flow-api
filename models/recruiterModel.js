const mongoose = require("mongoose");

const sizesOfCompany = ['0-50', '50-100', '100-250', '250-500', '500-750', '750-1000', '1000+']
const recruiterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nameOfCompany: {
        type: String,
        required: true
    },
    companyUrl: String,
    sizeOfCompany: {
        type: String,
        enum: sizesOfCompany,
        required: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;