import { Response, Request } from "express";
import prisma from "../prisma";

export const getAllBusquedas = async (_req:Request, res:Response) : Promise<any> => {
    const busquedas = await prisma.busquedas.findMany({
        include:{usuarios:true}
    });
    res.json(busquedas);
}

export const getBusquedaById = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const busquedaById = await prisma.busquedas.findUnique({ 
        where:{id}, 
        include:{usuarios:true}
    });
    if (!busquedaById) 
    {
        return res.status(404).json({ message:"Busqueda no encontrada"});      
    }
    res.json(busquedaById);
}

export const getBusquedaByUser = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.userId);
    const busquedasByUser = await prisma.busquedas.findMany({ 
        where:{usuario_id:id}, 
        include:{usuarios:true}
    });
    if (!busquedasByUser) 
    {
        return res.status(404).json({ message:"El usuario no posee busquedas"});      
    }
    res.json(busquedasByUser);
}

export const updateBusqueda = async (req:Request, res:Response) :Promise <any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;
    try 
    {
        const busqueda = await prisma.busquedas.update({
            where: { id },
            data : dataBody,
        })    
        res.json({code:1, message: "Se actualizo la busqueda", busqueda});

    } catch (error) 
    {
        return res.status(404).json({ message: "Error al realizar el update de la busqueda" });
    
    }
}

export const createBusqueda = async (req:Request, res:Response) :Promise <any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;
    try 
    {
        const busqueda = await prisma.busquedas.create({
            data : dataBody,
            include :{ usuarios: true }
        })    
        res.json({code:1, message: "Se agrego el busqueda", busqueda});

    } catch (error) 
    {
        return res.status(404).json({ message: "Error al agregar busqueda" });
    
    }
}

export const deleteBusqueda = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);

    try {
      const busqueda = await prisma.busquedas.delete({
        where: { id }
      })

      res.json({code:1, message: "Se elimina el busqueda", busqueda});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de busqueda" });
    }
}

