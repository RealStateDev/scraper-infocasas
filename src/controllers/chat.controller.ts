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
    res.status(201).json({code:1,message: "Chat creado", data:chat});
  } catch (error) {
    console.error("Error al crear chat:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

// Agregar mensaje a un chat existente
export const addMessageToChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);
    const { contenido, tipo } = req.body;

    if (!contenido || !tipo) {
      res.status(400).json({code:0,message: "Contenido y tipo son requeridos" });
      return;
    }

    const mensaje = await prisma.mensajes.create({
      data: {
        chat_id,
        contenido,
        tipo,
      },
    });

    res.status(201).json({code:1,message: "Mensaje agregado", data:mensaje });
  } catch (error) {
    console.error("Error al agregar mensaje:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
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
    
    const mensajesFormatted = {code:1, messageList:mensajes, messageCount:mensajes.length}
    res.json(mensajesFormatted);

  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

//Obtener todos los chats de un usuario
export const getChatsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = parseInt(req.params.userId);

    const chats = await prisma.chats.findMany({
      where: { usuario_id },
      orderBy: { fecha: "asc" },
      include:{usuarios:true, mensajes:true}
    });

    const chatsFormatted = {code:1, chatsList:chats, chatsCount:chats.length}
    res.json(chatsFormatted);

  } catch (error) {
    console.error("Error al obtener los chats del usuario:", error);
    res.status(500).json({code:0, message: "Error interno del servidor" });
  }
};

//Eliminar chat
export const deleteChat = async (req: Request, res: Response) : Promise<any> => {
  const id = parseInt(req.params.id);

  try {
    const chat = await prisma.chats.delete({
      where: { id }
    })

    res.json({code:1, message: "Se elimina el chat", deletedData:chat});

  } catch (error) {
    return res.status(404).json({code: 0,  message: "Error al realizar el delete del chat" });
  }
}