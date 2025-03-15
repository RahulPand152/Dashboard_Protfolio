import express from "express"
import { addNewProject, deleteProject, updateProject,getsingleProject,getAllProject } from "../controller/projectController.js"
import { isAuthenticated } from "../middleware/authication.js";
const router = express.Router()

router.post("/add", isAuthenticated, addNewProject)
router.delete("/delete/:id", isAuthenticated, deleteProject)
router.put("/update/:id", isAuthenticated, updateProject)
router.get("/getall", getAllProject)
router.get("/get/:id", getsingleProject)




export default router;