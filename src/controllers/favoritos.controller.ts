import { Response, Request } from "express";
import prisma from "../prisma";

export const getAllFavorites = async (_req:Request, res:Response) : Promise<any> => {
    const favoritos = await prisma.favoritos.findMany({
        include:{propiedades:true, usuarios:true}
    });
    if (!favoritos) {
        return res.status(404).json({code:0, message: "No hay favoritos registrados" });
    }
    const FavoritosFormatted = {code:1, favoritosList:favoritos, favoritosCount:favoritos.length};
    res.json(FavoritosFormatted);
}

export const getFavoriteById = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.id);
    const favoritoById = await prisma.favoritos.findUnique({ 
        where:{id}, 
        include:{propiedades:true, usuarios:true}
    });
    if (!favoritoById) 
    {
        return res.status(404).json({ code:0,message:"Favorito no encontrado"});      
    }
    const favoritoByIdFormatted = {code:1, data:favoritoById}
    res.json(favoritoByIdFormatted);
}

export const getFavoriteByUser = async (req:Request, res:Response) : Promise<any> => {
    const id = parseInt(req.params.userId);
    const favoritoByUser = await prisma.favoritos.findMany({ 
        where:{usuario_id:id}, 
        include:{propiedades:true, usuarios:true}
    });
    if (!favoritoByUser) 
    {
        return res.status(404).json({code:0, message:"El usuario no posee favoritos"});      
    }
    const favoritoByUserFormatted = {code:1, data:favoritoByUser, favoritoCount:favoritoByUser.length}

    res.json(favoritoByUserFormatted);
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
        res.json({code:1, message: "Se actualizó el favorito", updatedData:favorito, updatedFields:Object.keys(dataBody)});

    } catch (error) 
    {
        return res.status(404).json({code:0,message: "Error al realizar el update de favorito" });
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
        res.json({code:1, message: "Se agregó el favorito", data:favorito});

    } catch (error) 
    {
        return res.status(404).json({code:0,message: "Error al realizar el agregado de favorito"});
    }
}

export const deleteFavorite = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);

    try {
      const favorito = await prisma.favoritos.delete({
        where: { id }
      })

      res.json({code:1, message: "Se elimina el favorito", deletedData:favorito});

    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de favorito" });
    }
}
