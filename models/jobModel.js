const mongoose = require("mongoose");

const yearsOfService = ["0", "1", "2", "3", "4"]
const typesOfEmployement = ['full-time', 'contract', 'internship']
const jobSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    
    nameOfCompany: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    costToCompany: {
        type: Number,
        required: true
    },
    openings: {
        type: Number,
        required: true
    },
    serviceAgreement: {
        type: String,
        enum: yearsOfService,
        required: true
    },
    typeOfEmployement: {
        type: String,
        enum: typesOfEmployement,
        required: true
    },
    applyBy: {
        type: Date,
        required: true
    },
    eligibilityCriteria: {
        educationDetails: {
            type: String,
            required: true
        },
        yearOfGraduation: {
            type: String,
            required: true
        }
    },
    jobLocation: {
        type: String,
        required: true
    },
    skillsRequired: [{
        type: String,
        required: true
    }]
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job;