import Message from "../models/Message.js"

export const createMessage = async (req, res) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email, and message are required" })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" })
    }

    try {
        const newMessage = await Message.create({ name, email, message })
        res.status(201).json({ success: true, count: 1, data: newMessage })
    } catch (error) {
        console.error("Error creating message:", error)
        res.status(500).json({ success: false, message: "Server error while sending message" })
    }
}
