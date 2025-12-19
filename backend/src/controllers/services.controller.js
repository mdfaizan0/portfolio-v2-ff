import Service from "../models/Service.js"
import { handleStorageDelete, signURL } from "../utils/supabaseHandler.js"

export const fetchServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 }).lean()
        await Promise.all(services.map(async service => {
            service.image = {
                path: service.image,
                url: await signURL(service.image)
            }
        }))
        res.status(200).json({ success: true, count: services.length, data: services })
    } catch (error) {
        console.error("Error fetching services:", error)
        res.status(500).json({ success: false, message: "Server error while fetching services" })
    }
}

export const fetchServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).lean()
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }
        service.image = {
            path: service.image,
            url: await signURL(service.image)
        }
        res.status(200).json({ success: true, data: service })
    } catch (error) {
        console.error("Error fetching service:", error)
        res.status(500).json({ success: false, message: "Server error while fetching service" })
    }
}

export const createService = async (req, res) => {
    const { title, description, image, price } = req.body

    if (!title || !description || !image) {
        return res.status(400).json({ success: false, message: "Title, description, and image are required" })
    }

    try {
        const service = await Service.create({ title, description, image, price })
        res.status(201).json({ success: true, data: service })
    } catch (error) {
        console.error("Error creating service:", error)
        res.status(500).json({ success: false, message: "Server error while creating service" })
    }
}

export const updateService = async (req, res) => {
    const { id } = req.params
    const { title, description, image, price } = req.body

    try {
        const data = {}
        if (title !== undefined) data.title = title
        if (description !== undefined) data.description = description
        if (price !== undefined) data.price = price
        if (image !== undefined) {
            const oldService = await Service.findById(id);
            if (oldService.image !== image) {
                await handleStorageDelete(oldService.image);
            }
            data.image = image;
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, message: "At least one field required" })
        }

        const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }
        res.status(200).json({ success: true, data: service })
    } catch (error) {
        console.error("Error updating service:", error)
        res.status(500).json({ success: false, message: "Server error while updating service" })
    }
}

export const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id)
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }
        if (service.image) await handleStorageDelete(service.image)
        res.status(200).json({ success: true, message: "Service deleted successfully" })
    } catch (error) {
        console.error("Error deleting service:", error)
        res.status(500).json({ success: false, message: "Server error while deleting service" })
    }
}
