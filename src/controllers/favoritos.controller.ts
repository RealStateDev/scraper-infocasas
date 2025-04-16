import { Response, Request } from "express";
import prisma from "../prisma";

export const getAllFavorites = async (_req:Request, res:Response) : Promise<any> => {
    const favoritos = await prisma.favoritos.findMany({
        include:{propiedades:true, usuarios:true}
    });
    res.json(favoritos);
}

export const getFavoriteById = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const favoritoById = await prisma.favoritos.findUnique({ 
        where:{id}, 
        include:{propiedades:true, usuarios:true}
    });
    if (!favoritoById) 
    {
        return res.status(404).json({ message:"Favorito no encontrado"});      
    }
    res.json(favoritoById);
}

export const getFavoriteByUser = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.userId);
    const favoritoByUser = await prisma.favoritos.findMany({ 
        where:{usuario_id:id}, 
        include:{propiedades:true, usuarios:true}
    });
    if (!favoritoByUser) 
    {
        return res.status(404).json({ message:"El usuario no posee favoritos"});      
    }
    res.json(favoritoByUser);
}

export const updateFavorite = async (req:Request, res:Response) :Promise <any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;
    try 
    {
        const favorito = await prisma.favoritos.update({
            where: { id },
            data : dataBody,
        })    
        res.json({code:1, message: "Se actualizo el favorito", favorito});

    } catch (error) 
    {
        return res.status(404).json({ message: "Error al realizar el update de favorito" });
    
    }
}

export const createFavorite = async (req:Request, res:Response) :Promise <any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;
    try 
    {
        const favorito = await prisma.favoritos.create({
            data : dataBody
        })    
        res.json({code:1, message: "Se agrego el favorito", favorito});

    } catch (error) 
    {
        return res.status(404).json({ message: "Error al realizar el agregado de favorito" });
    
    }
}

export const deleteFavorite = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);

    try {
      const favorito = await prisma.favoritos.delete({
        where: { id }
      })

      res.json({code:1, message: "Se elimina el favorito", favorito});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de favorito" });
    }
}
