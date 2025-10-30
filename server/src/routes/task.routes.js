import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    createTask, listTasks, getTask, updateTask, deleteTask
} from "../controllers/task.controller.js";

const router = Router();

router.use(requireAuth); // every route below requires JWT auth

router.post("/", createTask);
router.get("/", listTasks);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;