import { Router } from "express";
import {
  createChat,
  addMessageToChat,
  getChatHistory,
} from "../controllers/chat.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Crear nuevo chat (opcionalmente con token si está logueado)
router.post("/chats", verifyToken, createChat);

// Agregar mensaje a un chat
router.post("/chats/:id/mensajes", addMessageToChat);

// Obtener historial de un chat
router.get("/chats/:id", getChatHistory);

export default router;
