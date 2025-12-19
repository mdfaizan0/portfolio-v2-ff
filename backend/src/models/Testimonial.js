import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    quote: {
        type: String,
        required: true
    },
    designation: {
        type: String
    }
}, { timestamps: true })

const Testimonial = mongoose.model("Testimonial", testimonialSchema)

export default Testimonial