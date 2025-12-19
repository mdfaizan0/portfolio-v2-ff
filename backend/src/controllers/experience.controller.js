import Experience from "../models/Experience.js"

export const fetchExperience = async (_, res) => {
    try {
        const experience = await Experience.find().sort({ startDate: -1 }).lean()
        res.status(200).json({ success: true, count: experience.length, data: experience })
    } catch (error) {
        console.error("Error fetching experience:", error)
        res.status(500).json({ success: false, message: "Server error while fetching experience" })
    }
}

export const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id).lean();
        if (!experience) {
            return res.status(404).json({ success: false, message: "Experience not found" });
        }
        res.status(200).json({ success: true, data: experience });
    } catch (error) {
        console.error("Error fetching experience:", error);
        res.status(500).json({ success: false, message: "Server error while fetching experience" });
    }
};

export const createExperience = async (req, res) => {
    const { role, company, startDate, endDate, description } = req.body

    if (!role || !company || !description) {
        return res.status(400).json({ success: false, message: "Role, company, and description are required" })
    }

    if (startDate && isNaN(Date.parse(startDate))) {
        return res.status(400).json({ success: false, message: "Invalid startDate" })
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({ success: false, message: "Invalid endDate" })
    }

    try {
        const experience = await Experience.create({ role, company, startDate, endDate, description })
        res.status(201).json({ success: true, data: experience })
    } catch (error) {
        console.error("Error creating experience:", error)
        res.status(500).json({ success: false, message: "Server error while creating experience" })
    }
}

export const updateExperience = async (req, res) => {
    const { id } = req.params
    const { role, company, startDate, endDate, description } = req.body

    try {
        const data = {}
        if (role !== undefined) data.role = role
        if (company !== undefined) data.company = company
        if (startDate !== undefined) data.startDate = startDate
        if (endDate !== undefined) data.endDate = endDate
        if (description !== undefined) data.description = description

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, message: "At least one field required" })
        }

        const experience = await Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!experience) {
            return res.status(404).json({ success: false, message: "Experience not found" })
        }
        res.status(200).json({ success: true, data: experience })
    } catch (error) {
        console.error("Error updating experience:", error)
        res.status(500).json({ success: false, message: "Server error while updating experience" })
    }
}

export const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id)
        if (!experience) {
            return res.status(404).json({ success: false, message: "Experience not found" })
        }
        res.status(200).json({ success: true, message: "Experience deleted successfully" })
    } catch (error) {
        console.error("Error deleting experience:", error)
        res.status(500).json({ success: false, message: "Server error while deleting experience" })
    }
}
