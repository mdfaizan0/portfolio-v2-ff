import About from "../models/About.js"
import { handleStorageDelete, signURL } from "../utils/supabaseHandler.js"

export const fetchAbout = async (req, res) => {
    try {

        const about = await About.findOne().lean()
        if (!about) {
            return res.status(404).json({ message: "About not found" })
        }

        about.profileImage = {
            path: about.profileImage,
            url: await signURL(about.profileImage)
        }

        res.status(200).json({
            success: true,
            count: 1,
            data: about
        })
    } catch (error) {
        console.error("Error fetching about", error)
        res.status(500).json({ message: "Server error while fetching about" })
    }
}

export const createAbout = async (req, res) => {
    const { name, role, bio, profileImage, resumeUrl, socialLinks } = req.body

    if (!name || !role || !bio) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const existing = await About.findOne().lean()
        if (existing) return res.status(409).json({ message: "About already exists" })

        const about = await About.create({
            name,
            role,
            bio,
            profileImage,
            resumeUrl,
            socialLinks: Array.isArray(socialLinks) ? socialLinks : []
        })
        res.status(201).json({
            success: true,
            data: about
        })
    } catch (error) {
        console.error("Error creating about", error)
        res.status(500).json({
            success: false,
            message: "Server error while creating about"
        })
    }
}

export const updateAbout = async (req, res) => {
    const { name, role, bio, profileImage, resumeUrl, socialLinks } = req.body

    try {
        const about = await About.findOne()

        if (!about) {
            return res.status(404).json({ message: "About not found" })
        }

        let data = {}
        if (name !== undefined) data.name = name
        if (role !== undefined) data.role = role
        if (bio !== undefined) data.bio = bio
        if (resumeUrl !== undefined) data.resumeUrl = resumeUrl
        if (socialLinks !== undefined) data.socialLinks = Array.isArray(socialLinks) ? socialLinks : []
        if (profileImage !== undefined && profileImage !== about.profileImage) {
            await handleStorageDelete(about.profileImage);
            data.profileImage = profileImage;
        }

        const updated = await About.findByIdAndUpdate(about._id, data, { new: true })
        return res.status(200).json({
            success: true,
            data: updated
        })
    } catch (error) {
        console.error("Error updating about", error)
        res.status(500).json({ success: false, message: "Server error while updating about" })
    }
}


export const deleteAbout = async (req, res) => {
    try {
        const about = await About.findOne()
        if (!about) return res.status(404).json({ success: false, message: "About not found" })

        await About.findByIdAndDelete(about._id)
        if (about?.profileImage) await handleStorageDelete(about.profileImage)
        res.status(200).json({
            success: true,
            message: "About deleted successfully!"
        })
    } catch (error) {
        console.error("Error deleting about", error)
        res.status(500).json({
            success: false,
            message: "Server error while deleting about"
        })
    }
}