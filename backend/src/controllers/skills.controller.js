import Skill from "../models/Skill.js"

export const fetchSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: -1 }).lean()

        // Icon is now always a string (simple-icons slug with si prefix)
        // No need to sign URLs or transform

        res.status(200).json({ success: true, count: skills.length, data: skills })
    } catch (error) {
        console.error("Error fetching skills:", error)
        res.status(500).json({ success: false, message: "Server error while fetching skills" })
    }
}

export const createSkill = async (req, res) => {
    const { name, level, icon } = req.body

    if (!name || !level || !icon) {
        return res.status(400).json({ success: false, message: "Name, level, and icon are required" })
    }

    try {
        const existing = await Skill.findOne({ name })
        if (existing) return res.status(409).json({ success: false, message: "Skill already exists" })

        const skill = await Skill.create({ name, level, icon })
        res.status(201).json({ success: true, data: skill })
    } catch (error) {
        console.error("Error creating skill:", error)
        res.status(500).json({ success: false, message: "Server error while creating skill" })
    }
}

export const updateSkill = async (req, res) => {
    const { id } = req.params
    const { name, level, icon } = req.body

    if (!name && !level && !icon) {
        return res.status(400).json({ success: false, message: "At least one field is required" })
    }

    try {
        const data = {}
        if (name !== undefined) data.name = name
        if (level !== undefined) data.level = level
        if (icon !== undefined) data.icon = icon // Icon is just a string, no cleanup needed

        const skill = await Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!skill) {
            return res.status(404).json({ success: false, message: "Skill not found" })
        }
        res.status(200).json({ success: true, data: skill })
    } catch (error) {
        console.error("Error updating skill:", error)
        res.status(500).json({ success: false, message: "Server error while updating skill" })
    }
}

export const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id)
        if (!skill) {
            return res.status(404).json({ success: false, message: "Skill not found" })
        }
        // Icon is just a string, no storage cleanup needed
        res.status(200).json({ success: true, message: "Skill deleted successfully" })
    } catch (error) {
        console.error("Error deleting skill:", error)
        res.status(500).json({ success: false, message: "Server error while deleting skill" })
    }
}
