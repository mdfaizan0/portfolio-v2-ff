import Testimonial from "../models/Testimonial.js"
import { handleStorageDelete, signURL } from "../utils/supabaseHandler.js"

export const fetchTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean()
        await Promise.all(testimonials.map(async testimonial => {
            testimonial.avatar = {
                path: testimonial.avatar,
                url: await signURL(testimonial.avatar)
            }
        }))
        res.status(200).json({ success: true, count: testimonials.length, data: testimonials })
    } catch (error) {
        console.error("Error fetching testimonials:", error)
        res.status(500).json({ success: false, message: "Server error while fetching testimonials" })
    }
}

export const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id).lean();
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        }
        if (testimonial.avatar) {
            testimonial.avatar = {
                path: testimonial.avatar,
                url: await signURL(testimonial.avatar)
            };
        }
        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error("Error fetching testimonial:", error);
        res.status(500).json({ success: false, message: "Server error while fetching testimonial" });
    }
};

export const createTestimonial = async (req, res) => {
    const { name, avatar, quote, designation } = req.body

    if (!name || !quote) {
        return res.status(400).json({ success: false, message: "Name and quote are required" })
    }

    try {
        const testimonial = await Testimonial.create({ name, avatar, quote, designation })
        res.status(201).json({ success: true, data: testimonial })
    } catch (error) {
        console.error("Error creating testimonial:", error)
        res.status(500).json({ success: false, message: "Server error while creating testimonial" })
    }
}

export const updateTestimonial = async (req, res) => {
    const { id } = req.params
    const { name, avatar, quote, designation } = req.body

    try {
        const data = {}
        if (name !== undefined) data.name = name
        if (avatar !== undefined) {
            const oldTestimonial = await Testimonial.findById(id);
            if (oldTestimonial.avatar !== avatar) {
                await handleStorageDelete(oldTestimonial.avatar);
            }
            data.avatar = avatar;
        }
        if (quote !== undefined) data.quote = quote
        if (designation !== undefined) data.designation = designation

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, message: "At least one field required" })
        }

        const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" })
        }
        res.status(200).json({ success: true, data: testimonial })
    } catch (error) {
        console.error("Error updating testimonial:", error)
        res.status(500).json({ success: false, message: "Server error while updating testimonial" })
    }
}

export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
        if (!testimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found" })
        }
        if (testimonial?.avatar) await handleStorageDelete(testimonial.avatar)
        res.status(200).json({ success: true, message: "Testimonial deleted successfully" })
    } catch (error) {
        console.error("Error deleting testimonial:", error)
        res.status(500).json({ success: false, message: "Server error while deleting testimonial" })
    }
}
