import { Request, Response } from "express";
import prisma from "../prisma";
import { addMonths, addYears } from "date-fns"

export interface SuscripcionInput {
  usuario_id?: number;
  tipo_suscripcion: string;
  fecha_inicio?: string;      // o Date, si ya lo convertís antes
  fecha_fin?: string;         // o Date
  activo?: boolean;
  tipo_facturacion: string;
  monto: number;
}




export const createSubscripcion = async (req: Request, res: Response): Promise<any> => {
  try {
    const dataBody: SuscripcionInput = req.body;
    
    //Calculo de fecha fin segun tipo de facturacion
    const fechaInicio = new Date();
    let fechaFin : Date | null = null;
    if (dataBody.tipo_facturacion == "mensual") {
      fechaFin = addMonths(fechaInicio, 1);
    }else if(dataBody.tipo_facturacion == "mensual"){
      fechaFin = addYears(fechaInicio, 1);
    }
 

    //End calculo de fecha fin segun tipo de facturacion


    const subs = await prisma.suscripciones.create({
      data: {
        usuario_id: dataBody.usuario_id,
        tipo_suscripcion: dataBody.tipo_suscripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        activo: dataBody.activo,
        tipo_facturacion: dataBody.tipo_facturacion,
        monto: dataBody.monto
      },
      include: { usuarios: true }
    });
    res.status(201).json({code:1,message: "Subscripción creada", data:subs});
  } catch (error) {
    console.error("Error al crear subscripción:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};


export const updateSubscripcion = async (req:Request, res:Response) :Promise <any> => {
    const id = parseInt(req.params.id);
    const dataBody = req.body;
    try 
    {
        const sub = await prisma.suscripciones.update({
            where: { id },
            data : dataBody,
        })    
        res.json({code:1, message: "Se actualizó la subscripcion", updatedData:sub, updatedFields:Object.keys(dataBody)});

    } catch (error) 
    {
        return res.status(404).json({code:0,message: "Error al realizar el update de subscripcion" });
    }
}

export const getSubsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario_id = parseInt(req.params.userId);

      const subs = await prisma.suscripciones.findMany({
        where: { usuario_id },
        include: { usuarios: true }
      });
      res.status(201).json({code:1, subsList:subs, subsCount:subs.length});
    } catch (error) {
      console.error("Error al traer las subscripciones:", error);
      res.status(500).json({code:0,message: "Error interno del servidor" });
    }
  };

  export const deleteSub = async (req: Request, res: Response) : Promise<any> => {
    const id = parseInt(req.params.id);
  
    try {
      const sub = await prisma.suscripciones.delete({
        where: { id }
      })
  
      res.json({code:1, message: "Se eliminó la subscripción", deletedData:sub});
  
    } catch (error) {
      return res.status(404).json({code: 0,  message: "Error al realizar el delete de la sub" });
    }
  }
  




