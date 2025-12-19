import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"

export const register = async (req, res) => {
    const { username, password, email, role } = req.body

    if (!username || !password || !email) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] })
        if (existingAdmin) {
            if (existingAdmin.username === username) {
                return res.status(400).json({ message: "Username already taken" })
            }
            if (existingAdmin.email === email) {
                return res.status(400).json({ message: "Email already taken" })
            }
            return res.status(400).json({ message: "Admin already exists" })
        }

        const passwordHashed = await bcrypt.hash(password, 10)
        const admin = await Admin.create({ username, password: passwordHashed, email, role })

        return res.status(201).json({ admin, message: `Admin ${admin.username} registered successfully` })
    } catch (error) {
        console.error("Error in register controller", error)
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, username, password } = req.body

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const admin = await Admin.findOne({ $or: [{ username }, { email }] }).select("+password")
        if (!admin) {
            return res.status(404).json({ message: "Unable to login" })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        return res.status(200).json({
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            },
            message: `Admin ${admin.username} logged in successfully`,
            token: generateToken(admin)
        })
    } catch (error) {
        console.error("Error in login controller", error)
        return res.status(500).json({ message: error.message })
    }
}