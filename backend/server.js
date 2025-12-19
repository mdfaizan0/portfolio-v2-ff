import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDatabase } from "./src/config/db.js"

// Import Routes
import authPublicRouter from "./src/routes/auth/auth.public.routes.js"

import projectPublicRouter from "./src/routes/projects/project.public.routes.js"
import projectAdminRouter from "./src/routes/projects/project.admin.routes.js"

import aboutPublicRouter from "./src/routes/about/about.public.routes.js"
import aboutAdminRouter from "./src/routes/about/about.admin.routes.js"

import blogsPublicRouter from "./src/routes/blogs/blogs.public.routes.js"
import blogsAdminRouter from "./src/routes/blogs/blogs.admin.routes.js"

import experiencePublicRouter from "./src/routes/experience/experience.public.routes.js"
import experienceAdminRouter from "./src/routes/experience/experience.admin.routes.js"

import servicesPublicRouter from "./src/routes/services/services.public.routes.js"
import servicesAdminRouter from "./src/routes/services/services.admin.routes.js"

import skillsPublicRouter from "./src/routes/skills/skills.public.routes.js"
import skillsAdminRouter from "./src/routes/skills/skills.admin.routes.js"

import testimonialsPublicRouter from "./src/routes/testimonials/testimonials.public.routes.js"
import testimonialsAdminRouter from "./src/routes/testimonials/testimonials.admin.routes.js"
import uploadRouter from "./src/routes/upload/upload.admin.routes.js"
import messageRouter from "./src/routes/message.routes.js"
import dashboardAdminRouter from "./src/routes/dashboard.admin.routes.js"


dotenv.config()
connectDatabase()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const CMS_URL = process.env.CMS_URL || "http://localhost:5173"

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mount Routes
app.use("/api/auth", authPublicRouter)

app.use("/api/projects", projectPublicRouter)
app.use("/api/about", aboutPublicRouter)
app.use("/api/blogs", blogsPublicRouter)
app.use("/api/experience", experiencePublicRouter)
app.use("/api/services", servicesPublicRouter)
app.use("/api/skills", skillsPublicRouter)
app.use("/api/testimonials", testimonialsPublicRouter)
app.use("/api/messages", messageRouter)

app.use("/api/admin/projects", projectAdminRouter)
app.use("/api/admin/about", aboutAdminRouter)
app.use("/api/admin/blogs", blogsAdminRouter)
app.use("/api/admin/experience", experienceAdminRouter)
app.use("/api/admin/services", servicesAdminRouter)
app.use("/api/admin/skills", skillsAdminRouter)
app.use("/api/admin/testimonials", testimonialsAdminRouter)
app.use("/api/admin/upload", uploadRouter)
app.use("/api/admin/dashboard", dashboardAdminRouter)


app.get("/", (_, res) => {
    res.send("Portfolio backend is live! 🚀")
})

app.use((req, res) => {
    console.log("req", req)
    res.status(404).json({ message: "Route not found" })
})

app.use((err, req, res, next) => {
    console.error("⚠️ Server Error:", err)
    res.status(500).json({ message: "Internal server error" })
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))