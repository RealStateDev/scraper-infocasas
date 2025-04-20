import { Router } from "express";
import { createSubscripcion, deleteSub, getSubsByUser } from "../controllers/subscripcion.controller";

const router = Router();

// Ruta protegida que requiere autenticación
router.get("/subscripcionByUser/:userId",getSubsByUser);
router.post("/subscripcion",createSubscripcion);
router.delete("/subscripcion/:id",deleteSub);

export default router;
