import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Admin from "../models/Admin.js"

dotenv.config()

export const protect = async (req, res, next) => {
    const authHeaders = req.headers.authorization

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const token = authHeaders.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const admin = await Admin.findById(decoded.id)
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.admin = admin
        next()
    } catch (error) {
        console.error("Error in protect middleware", error)
        if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" })
        return res.status(500).json({ message: "Server error while verifying token" })
    }
}

export const isSuper = (req, res, next) => {
    try {
        if (!req.admin || req.admin.role !== "superadmin") {
            return res.status(403).json({ message: "Forbidden: Superadmin access required" })
        }
        next()
    } catch (error) {
        console.error("Error in isSuper middleware", error)
        return res.status(500).json({ message: "Server error while verifying role" })
    }
}