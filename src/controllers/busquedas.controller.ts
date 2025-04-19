import { Response, Request } from "express";
import prisma from "../prisma";

export const getAllBusquedas = async (_req:Request, res:Response) : Promise<any> => {
    const busquedas = await prisma.busquedas.findMany({
        include:{usuarios:true}
    });
    if (!busquedas) {
        return res.status(404).json({code:0, message: "No existen búsquedas" });
    }
    const busquedasFormatted = {code:1, busquedasList:busquedas, busquedasCount:busquedas.length};
    res.json(busquedasFormatted);
}

export const getBusquedaById = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const busquedaById = await prisma.busquedas.findUnique({ 
        where:{id}, 
        include:{usuarios:true}
    });
    if (!busquedaById) 
    {
        return res.status(404).json({code:0,message:"Búsqueda no encontrada"});      
    }
    const busquedaByIdFormatted = {code:1, data:busquedaById};
    res.json(busquedaByIdFormatted);
}

export const getBusquedaByUser = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.userId);
    const busquedasByUser = await prisma.busquedas.findMany({ 
        where:{usuario_id:id}, 
        include:{usuarios:true}
    });
    if (!busquedasByUser) 
    {
        return res.status(404).json({code:0,message:"El usuario no posee búsquedas"});      
    }
    const busquedasByUserFormatted = {code:1, busquedasList:busquedasByUser, busquedasCount:busquedasByUser.length};
    res.json(busquedasByUserFormatted);
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
        res.json({code:1, message: "Se actualizó la búsqueda", updatedData:busqueda, updatedFields:Object.keys(dataBody)});

    } catch (error) 
    {
        return res.status(404).json({code:0,message: "Error al realizar el update de la búsqueda" });
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
        res.json({code:1, message: "Se agregó la búsqueda", data:busqueda});

    } catch (error) 
    {
        return res.status(404).json({code:0,message: "Error al agregar búsqueda" });
    }
}

export const deleteBusqueda = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);

    try {
      const busqueda = await prisma.busquedas.delete({
        where: { id }
      })

      res.json({code:1, message: "Se elimina la búsqueda", deletedData:busqueda});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de búsqueda" });
    }
}

