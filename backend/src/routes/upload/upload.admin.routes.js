import express from "express"
import { isSuper, protect } from "../../middlewares/auth.middleware.js"
import { upload } from "../../middlewares/multer.middleware.js"
import { deleteImage, uploadImage } from "../../controllers/upload.controller.js"

const uploadRouter = express.Router()

uploadRouter.post("/", protect, isSuper, upload, uploadImage)
uploadRouter.delete("/", protect, isSuper, deleteImage)

export default uploadRouter