import multer from "multer"

const storage = multer.memoryStorage()

const uploadMultiple = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) cb(new Error("Only Image files are allowed"))
        cb(null, true)
    }
})

export const upload = uploadMultiple.array("files", 5)