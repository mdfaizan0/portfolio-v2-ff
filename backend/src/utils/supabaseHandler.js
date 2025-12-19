import { supabaseAdmin } from "./supabase.js"

export const signURL = async (path, options = {}) => {
    const { data, error } = await supabaseAdmin.storage
        .from("portfolio-media")
        .createSignedUrl(path, 3600, options)

    if (error) {
        console.error("Error signing URL", error)
        throw new Error("Failed to sign URL")
    }

    return data.signedUrl
}

export const signURLs = async (paths) => {
    const promises = paths.map(async (path) => {
        return signURL(path)
    })
    return Promise.all(promises)
}

export const handleStorageDelete = async (path) => {
    try {
        const { error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .remove([path])
        if (error) {
            console.error("Error deleting file", error)
            throw new Error(error.message || "Failed to delete file")
        }
    } catch (error) {
        console.error("Error deleting file", error)
        throw new Error("Failed to delete file")
    }
}