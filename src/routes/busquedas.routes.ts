import { Router } from "express";
import {createBusqueda, getAllBusquedas, getBusquedaById, getBusquedaByUser, deleteBusqueda, updateBusqueda } from "../controllers/busquedas.controller";

const busquedasRouter = Router();

busquedasRouter.post("/busquedas",createBusqueda);
busquedasRouter.put("/busquedas/:id",updateBusqueda);
busquedasRouter.get("/busquedas",getAllBusquedas);
busquedasRouter.get("/busquedas/:id",getBusquedaById);
busquedasRouter.get("/busquedasByUser/:userId",getBusquedaByUser);
busquedasRouter.delete("/busquedas/:id",deleteBusqueda);

export default busquedasRouter;