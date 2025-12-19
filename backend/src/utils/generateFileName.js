import { convertToSlug } from "./convertBlogContent.js"

export const generateFileName = (file) => {
    const slugified = convertToSlug(file.originalname)
    const extension = file.mimetype.split("/")[1]
    return `${slugified}-${Date.now()}.${extension}`
}