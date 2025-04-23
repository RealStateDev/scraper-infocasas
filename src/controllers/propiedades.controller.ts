import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllProperties = async (req: Request, res: Response): Promise<any> => {
  //parámetros
  const page = parseInt(req.query.page as string) || 1;     
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const total = await prisma.propiedades.count();

  if (total === 0) {
    return res.status(404).json({ code: 0, message: "No hay propiedades en la base de datos" });
  }

  const propiedades = await prisma.propiedades.findMany({
    skip,
    take: limit,
    orderBy: { id: "desc" },
  });

  const response = {
    code: 1,
    page,
    perPage: limit,
    total,
    totalPages: Math.ceil(total / limit),  
    propiedadesList: propiedades,
  };

  res.json(response);
};

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

  
  
  




