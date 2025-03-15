import express from "express"
import { register ,login, logout, getUser, updateProfile, updatePassword, getUserPortfolio, forgotPassword, resetPassword } from "../controller/userController.js";
import { isAuthenticated } from "../middleware/authication.js";

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser)
router.put("/update/me", isAuthenticated, updateProfile)
router.put("/update/password", isAuthenticated, updatePassword)
router.get("/me/portfoli", getUserPortfolio)
router.post("/password/forgot", forgotPassword)
router.post("/password/reset/:token", resetPassword)




export default router;