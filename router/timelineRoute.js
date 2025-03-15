import express from "express"
import { postTimeline,deleteTime,getAllTimelines } from "../controller/timelineController.js";
import { isAuthenticated } from "../middleware/authication.js";

const router = express.Router()

router.post("/add", isAuthenticated,postTimeline)
router.delete("/delete/:id", isAuthenticated, deleteTime)
router.get("/getall", getAllTimelines)
export default router;