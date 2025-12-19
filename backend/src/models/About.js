import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    resumeUrl: {
        type: String
    },
    socialLinks: {
        type: [{
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }]
    }
})

const About = mongoose.model("About", aboutSchema)

export default About