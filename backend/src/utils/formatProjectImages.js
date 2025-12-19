export const formatProjectImages = (images) => {
    const formattedImages = images.map((img, index) => {
        if (!img.path) {
            throw new Error("Each image needs to have a path field")
        }

        return {
            path: img.path,
            order: img.order ?? index
        }
    })
    formattedImages.sort((a, b) => a.order - b.order)
    return formattedImages
}