import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export async function connectDatabase() {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI)
        console.log(`📁 MongoDB Connected: ${connected.connection.host}`)
    } catch (error) {
        console.error(`Error connecting DB: ${error.message}`)
    }
}