import mongoose from "mongoose";

const expSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    description: {
        type: String,
        required: true
    }
})

const Experience = mongoose.model("Experience", expSchema)

export default Experience