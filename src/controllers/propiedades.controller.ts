import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllProperties = async (_req: Request, res: Response) : Promise<any>=> {
    const propiedades = await prisma.propiedades.findMany();
    if (!propiedades) {
      return res.status(404).json({code:0, message: "No hay propiedades en la base de datos" });
    }
    const propiedadesFormatted = {code:1, propiedadesList:propiedades, propiedadesCount:propiedades.length};
    res.json(propiedadesFormatted);
}
export const getPropertyById = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const propiedad = await prisma.propiedades.findUnique({ where: { id } });
    if (!propiedad) {
      return res.status(404).json({code:0, message: "Propiedad no encontrada" });
    }
    const propiedadFormatted = {code:1, data:propiedad}
    res.json(propiedadFormatted);
  };

  export const updateProperty = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;

    try {
      const propiedad = await prisma.propiedades.update({
        where: { id },
        data : dataBody,
      })

      res.json({code:1, message: "Se actualizó la propiedad", updatedData:propiedad, updatedFields:Object.keys(dataBody) });

    } catch (error) {
      return res.status(404).json({code:0, message: "Error al realizar el update" });
    }
  };

  export const deleteProperty = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;

    try {
      const propiedad = await prisma.propiedades.delete({
        where: { id }
      })

      res.json({code:1, message: "Se eliminó la propiedad", deletedData:propiedad});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete" });
    }
  };

  
  
  




