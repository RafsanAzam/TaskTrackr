import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// quick protected test
router.get("/me", requireAuth, (req, res) => {
    res.json({ me: req.user });
});

export default router;