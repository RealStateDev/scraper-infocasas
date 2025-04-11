import { Request, Response } from "express";
import prisma from "../prisma";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.user as { userId: number; email: string };

    const user = await prisma.usuarios.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const { password_hash, ...profile } = user;
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
