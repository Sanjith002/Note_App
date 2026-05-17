import express from "express"
import { register,login,getCurrentUser,uploadProfileImage,logout } from "../controller/authController.js"
import upload from "../middleware/fileUpload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", upload.single("profile_image"), register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", auth, getCurrentUser )
router.post("/upload-profile-image", auth, upload.single("profile_image"), uploadProfileImage)

export default router;