import { Router } from "express";
import { postMessage } from "../controllers/chatPlanner.controller";

export const chatPlannerRouter = Router();
chatPlannerRouter.post("/message", postMessage);
