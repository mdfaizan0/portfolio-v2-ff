import { generateFileName } from "../utils/generateFileName.js"
import { supabaseAdmin } from "../utils/supabase.js"
import { signURL } from "../utils/supabaseHandler.js"

export const uploadImage = async (req, res) => {
    const { folder } = req.query
    const files = req.files

    if (!folder) {
        return res.status(400).json({ success: false, message: "Folder name is required" })
    }
    if (files.length === 0) {
        return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    try {
        if (files.length > 1) {
            const uploadPromises = files.map(async (file) => {
                const safeName = generateFileName(file)
                const fullPath = `${folder}/${safeName}`
                const { data, error } = await supabaseAdmin
                    .from("portfolio-media")
                    .upload(fullPath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: false
                    })
                if (error) {
                    console.error("Error uploading file", error)
                    throw new Error(`Unable to upload file: ${file.originalname}`)
                }
                return data.path
            })
            const results = await Promise.all(uploadPromises)
            return res.status(200).json({ success: true, message: "Files uploaded successfully", results })
        } else {
            const file = files[0]
            const safeName = generateFileName(file)
            const fullPath = `${folder}/${safeName}`
            const { data, error } = await supabaseAdmin.storage
                .from("portfolio-media")
                .upload(fullPath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                })
            if (error) {
                console.error("Error uploading file", error)
                return res.status(500).json({ success: false, message: `Unable to upload file: ${file.originalname}` })
            }

            // Sign the URL so frontend can display it immediately
            const signedUrl = await signURL(data.path)
            return res.status(200).json({ success: true, message: "File uploaded successfully", path: data.path, url: signedUrl })
        }
    } catch (error) {
        console.error("Error in uploadImage controller", error)
        return res.status(500).json({ success: false, message: "Server error while uploading file(s)" })
    }
}

export const deleteImage = async (req, res) => {
    const { paths } = req.body

    if (!paths || !Array.isArray(paths)) {
        return res.status(400).json({ message: "paths array is required" })
    }

    try {
        const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .remove(paths)

        if (error) {
            console.error("Error deleting file(s):", error)
            return res.status(500).json({ success: false, message: "Failed to delete file(s)" })
        }

        return res.status(200).json({ success: true, message: "File(s) deleted successfully", deleted: data })
    } catch (error) {
        console.error("Error in deleteImage controller", error)
        return res.status(500).json({ success: false, message: "Server error while deleting file" })
    }
}