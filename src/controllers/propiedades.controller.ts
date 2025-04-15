import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllProperties = async (_req: Request, res: Response) => {
    const propiedades = await prisma.propiedades.findMany();
    res.json(propiedades);
}
export const getPropertyById = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const propiedad = await prisma.propiedades.findUnique({ where: { id } });
  
    if (!propiedad) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }
  
    res.json(propiedad);
  };

  export const updateProperty = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;

    try {
      const propiedad = await prisma.propiedades.update({
        where: { id },
        data : dataBody,
      })

      res.json({code:1, message: "Se actualizo la propiedad", propiedad   });

    } catch (error) {
      return res.status(404).json({ message: "Error al realizar el update" });
    }
  };

  export const deleteProperty = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;

    try {
      const propiedad = await prisma.propiedades.delete({
        where: { id }
      })

      res.json({code:1, message: "Se elimina la propiedad", propiedad});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el update" });
    }
  };

  
  
  




