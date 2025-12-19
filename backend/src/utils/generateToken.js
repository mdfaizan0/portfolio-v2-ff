import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export function generateToken(user) {
    return jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })
}