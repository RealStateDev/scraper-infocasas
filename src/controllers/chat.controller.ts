import { Request, Response } from "express";
import prisma from "../prisma";

// Crear un nuevo chat
export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user ? (req.user as any).userId : null;

    const chat = await prisma.chats.create({
      data: {
        usuario_id,
      },
    });

    res.status(201).json({ message: "Chat creado", chat });
  } catch (error) {
    console.error("Error al crear chat:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Agregar mensaje a un chat existente
export const addMessageToChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);
    const { contenido, tipo } = req.body;

    if (!contenido || !tipo) {
      res.status(400).json({ message: "Contenido y tipo son requeridos" });
      return;
    }

    const mensaje = await prisma.mensajes.create({
      data: {
        chat_id,
        contenido,
        tipo,
      },
    });

    res.status(201).json({ message: "Mensaje agregado", mensaje });
  } catch (error) {
    console.error("Error al agregar mensaje:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los mensajes de un chat
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);

    const mensajes = await prisma.mensajes.findMany({
      where: { chat_id },
      orderBy: { fecha: "asc" },
    });

    res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
