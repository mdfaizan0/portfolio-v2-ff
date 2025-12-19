import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin", "superadmin"]
    }
}, { timestamps: true })

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin