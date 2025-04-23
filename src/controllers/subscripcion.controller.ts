import { Request, Response } from "express";
import prisma from "../prisma";

export const createSubscripcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataBody = req.body;
    const subs = await prisma.suscripciones.create({
      data: dataBody,
      include: { usuarios: true }
    });
    res.status(201).json({code:1,message: "Subscripción creada", data:subs});
  } catch (error) {
    console.error("Error al crear subscricion:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

export const getSubsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario_id = parseInt(req.params.userId);

      const subs = await prisma.suscripciones.findMany({
        where: { usuario_id },
        include: { usuarios: true }
      });
      res.status(201).json({code:1, subsList:subs, subsCount:subs.length});
    } catch (error) {
      console.error("Error al traer las subscriciones:", error);
      res.status(500).json({code:0,message: "Error interno del servidor" });
    }
  };

  export const deleteSub = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
  
    try {
      const sub = await prisma.suscripciones.delete({
        where: { id }
      })
  
      res.json({code:1, message: "Se eliminó la subscripcion", deletedData:sub});
  
    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de la sub" });
    }
  }
  




