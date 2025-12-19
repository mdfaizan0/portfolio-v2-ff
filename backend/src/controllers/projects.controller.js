import Project from "../models/Project.js"
import { formatProjectImages } from "../utils/formatProjectImages.js";
import { handleStorageDelete, signURL } from "../utils/supabaseHandler.js";

export const fetchProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: -1 }).lean()
        await Promise.all(projects.map(async project => {
            const thumbPromise = signURL(project.thumbnail)
            const imagesPromise = project.images.map(img => signURL(img.path, { transform: { width: 400, height: 300, resize: 'cover' } }))

            const [thumbnailURL, ...imageURLs] = await Promise.all([thumbPromise, ...imagesPromise])
            project.thumbnail = { path: project.thumbnail, url: thumbnailURL }
            project.images = project.images.map((img, idx) => ({ ...img, url: imageURLs[idx] }))
        }))
        res.status(200).json({ success: true, count: projects.length, data: projects })
    } catch (error) {
        console.error("Error fetching projects:", error)
        res.status(500).json({ success: false, message: "Server error while fetching projects" })
    }
}

export const fetchProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).lean()
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" })
        }
        project.thumbnail = { path: project.thumbnail, url: await signURL(project.thumbnail) }
        project.images = await Promise.all(project.images.map(async img => {
            return { ...img, url: await signURL(img.path) }
        }))
        res.status(200).json({ success: true, data: project })
    } catch (error) {
        console.error("Error fetching project:", error)
        res.status(500).json({ success: false, message: "Server error while fetching project" })
    }
}

export const createProject = async (req, res) => {
    const { title, description, thumbnail, images, technologies, liveURL, sourceURL, featured } = req.body

    if (!title || !description || !thumbnail || !technologies || technologies.length === 0 || !liveURL || !sourceURL) {
        return res.status(400).json({ success: false, message: "All required fields (title, description, thumbnail, technologies, liveURL, sourceURL) are required" })
    }

    if (!images || !Array.isArray(images)) {
        return res.status(400).json({
            success: false,
            message: "Images must be an array of {path, order}"
        });
    }

    try {

        const lastProject = await Project.findOne().sort({ order: -1 })
        const order = lastProject ? lastProject.order + 1 : 0

        const project = await Project.create({
            title,
            description,
            thumbnail,
            images: formatProjectImages(images),
            technologies,
            liveURL,
            sourceURL,
            featured: featured ?? false,
            order
        })
        res.status(201).json({ success: true, data: project })
    } catch (error) {
        console.error("Error creating project:", error)
        res.status(500).json({ success: false, message: "Server error while creating project" })
    }
}


export const updateProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const updatableFields = [
            "title", "description", "thumbnail", "images",
            "technologies", "liveURL", "sourceURL", "featured"
        ];

        const atLeastOneFieldPresent = updatableFields.some(f => f in req.body);

        if (!atLeastOneFieldPresent) {
            return res.status(400).json({ success: false, message: "At least one field required" });
        }

        const {
            title, description, thumbnail, images,
            technologies, liveURL, sourceURL, featured
        } = req.body;

        let data = {};

        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (technologies !== undefined) data.technologies = technologies;
        if (liveURL !== undefined) data.liveURL = liveURL;
        if (sourceURL !== undefined) data.sourceURL = sourceURL;
        if (featured !== undefined) data.featured = featured;

        if (thumbnail !== undefined && thumbnail !== project.thumbnail) {
            await handleStorageDelete(project.thumbnail);
            data.thumbnail = thumbnail;
        }

        if (images !== undefined) {
            const oldPaths = project.images.map(img => img.path);
            const newPaths = images.map(img => img.path);

            const removedPaths = oldPaths.filter(p => !newPaths.includes(p));

            for (const path of removedPaths) {
                await handleStorageDelete(path);
            }

            data.images = formatProjectImages(images);
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            data: updatedProject
        });

    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating project"
        });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const existing = await Project.findById(req.params.id)
        if (!existing) return res.status(404).json({ success: false, message: "Project not found" })

        let deletions = []
        if (existing.thumbnail) deletions.push(handleStorageDelete(existing.thumbnail))
        if (existing.images?.length) deletions.push(...existing.images.map(img => handleStorageDelete(img.path)))

        await Promise.all(deletions)
        await existing.deleteOne()
        res.status(200).json({ success: true, message: "Project deleted successfully" })
    } catch (error) {
        console.error("Error deleting project:", error)
        res.status(500).json({ success: false, message: "Server error while deleting project" })
    }
}