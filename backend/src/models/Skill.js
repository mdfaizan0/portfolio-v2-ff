import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced", "expert"]
    },
    icon: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Skill = mongoose.model("Skill", skillSchema)

export default Skill