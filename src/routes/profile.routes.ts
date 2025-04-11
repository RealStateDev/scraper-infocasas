import { Router } from "express";
import { getProfile } from "../controllers/profile.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Ruta protegida que requiere autenticación
router.get("/profile", verifyToken, getProfile);

export default router;
