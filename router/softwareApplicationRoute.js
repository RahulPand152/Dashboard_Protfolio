import express from "express"
import { addNewApplication,deleteApplication,getApplication } from "../controller/softwaApplicationController.js";
import { isAuthenticated } from "../middleware/authication.js";

const router = express.Router()

router.post("/add", isAuthenticated,addNewApplication)
router.delete("/delete/:id", isAuthenticated, deleteApplication)
router.get("/getall", getApplication)
export default router;