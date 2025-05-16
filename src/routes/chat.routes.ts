import { Router } from "express";
import {
  createChat,
  addMessageToChat,
  getChatHistory,
  getChatsByUser,
  deleteChat
} from "../controllers/chat.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

//15-05-2025 - Se quitó la verificación del Token, por el momento. Volver a agregar nuevamente.
// Crear nuevo chat (opcionalmente con token si está logueado)
router.post("/chats", createChat);

// Agregar mensaje a un chat
router.post("/chats/:id/mensajes", addMessageToChat);

// Obtener historial de un chat
router.get("/chats/:id", getChatHistory);

// Obtener chats de un usuario
router.get("/chatsByUser/:userId", getChatsByUser);

//Eliminar chats
router.delete("/chats/:id", deleteChat);

export default router;
