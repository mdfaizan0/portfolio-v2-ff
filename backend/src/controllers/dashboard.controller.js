import Blog from "../models/Blog.js";
import Project from "../models/Project.js";
import Message from "../models/Message.js";
import Experience from "../models/Experience.js";
import Service from "../models/Service.js";
import Skill from "../models/Skill.js";
import Testimonial from "../models/Testimonial.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            blogCount,
            projectCount,
            experienceCount,
            serviceCount,
            skillCount,
            testimonialCount,
            totalMessages,
            unreadMessages,
            recentMessages,
            recentBlogs,
            recentProjects
        ] = await Promise.all([
            Blog.countDocuments(),
            Project.countDocuments(),
            Experience.countDocuments(),
            Service.countDocuments(),
            Skill.countDocuments(),
            Testimonial.countDocuments(),
            Message.countDocuments(),
            Message.countDocuments({ isRead: false }),
            Message.find().sort({ createdAt: -1 }).limit(5).lean(),
            Blog.find().sort({ createdAt: -1 }).limit(3).lean(),
            Project.find().sort({ createdAt: -1 }).limit(3).lean()
        ]);

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    blogs: blogCount,
                    projects: projectCount,
                    experiences: experienceCount,
                    services: serviceCount,
                    skills: skillCount,
                    testimonials: testimonialCount,
                    messages: {
                        total: totalMessages,
                        unread: unreadMessages
                    }
                },
                recent: {
                    messages: recentMessages,
                    blogs: recentBlogs,
                    projects: recentProjects
                }
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Server error while fetching dashboard stats" });
    }
};

export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.status(200).json({ success: true, data: message });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ success: false, message: "Server error while updating message status" });
    }
};
