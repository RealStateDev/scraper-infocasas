// propiedades.routes.ts
import { Router } from "express";
import { getAllProperties, getPropertyById, updateProperty, deleteProperty } from "../controllers/propiedades.controller";

const router = Router();

router.get("/propiedades", getAllProperties);
router.get("/propiedades/:id",getPropertyById);
router.put("/propiedades/:id", updateProperty);
router.delete("/propiedades/:id", deleteProperty);

export default router;
