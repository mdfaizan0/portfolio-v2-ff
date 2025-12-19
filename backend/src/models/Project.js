import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [{ path: String, order: Number }],
        default: []
    },
    technologies: {
        type: [String],
        required: true
    },
    liveURL: {
        type: String,
        required: true
    },
    sourceURL: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema)

export default Project