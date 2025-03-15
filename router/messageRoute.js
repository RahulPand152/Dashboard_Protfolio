import express from "express"
import { getAllMessage, sendMessage, deleteMessage } from "../controller/messageController.js";
import { isAuthenticated } from "../middleware/authication.js";

const router = express.Router()

router.post("/send", sendMessage)
router.get("/getall", getAllMessage)
router.delete("/delete/:id",isAuthenticated, deleteMessage)

export default router;