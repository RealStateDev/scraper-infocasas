import { Request, Response } from "express";
import prisma from "../prisma";

// Crear un nuevo chat
export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = req.body ? req.body.usuario_id : null;
    const chat = await prisma.chats.create({
      data: {
        usuario_id,
      },
    });
    res.status(201).json({code:1,message: "Chat creado", data:chat});
  } catch (error) {
    console.error("Error al crear chat:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

// Agregar mensaje a un chat existente
export const addMessageToChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);
    const { contenido, tipo } = req.body;

    if (!contenido || !tipo) {
      res.status(400).json({code:0,message: "Contenido y tipo son requeridos" });
      return;
    }

    const mensaje = await prisma.mensajes.create({
      data: {
        chat_id,
        contenido,
        tipo,
      },
    });

    res.status(201).json({code:1,message: "Mensaje agregado", data:mensaje });
  } catch (error) {
    console.error("Error al agregar mensaje:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

// Obtener todos los mensajes de un chat
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);

    const mensajes = await prisma.mensajes.findMany({
      where: { chat_id },
      orderBy: { fecha: "asc" },
    });
    
    const mensajesFormatted = {code:1, messageList:mensajes, messageCount:mensajes.length}
    res.json(mensajesFormatted);

  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({code:0,message: "Error interno del servidor" });
  }
};

//Obtener todos los chats de un usuario
export const getChatsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario_id = parseInt(req.params.userId);

    const chats = await prisma.chats.findMany({
      where: { usuario_id },
      orderBy: { fecha: "asc" },
      include:{usuarios:true, mensajes:true}
    });

    const chatsFormatted = {code:1, chatsList:chats, chatsCount:chats.length}
    res.json(chatsFormatted);

  } catch (error) {
    console.error("Error al obtener los chats del usuario:", error);
    res.status(500).json({code:0, message: "Error interno del servidor" });
  }
};

//Eliminar chat
export const deleteChat = async (req: Request, res: Response) : Promise<any> => {
  const id = parseInt(req.params.id);

  try {
    const chat = await prisma.chats.delete({
      where: { id }
    })

    res.json({code:1, message: "Se elimina el chat", deletedData:chat});

  } catch (error) {
    return res.status(404).json({code: 0,  message: "Error al realizar el delete del chat" });
  }
};

/**
 * Flujo:
 *  1. Guarda mensaje usuario
 *  2. Obtiene historial (últimos 10 mensajes) -> esto para reducir costos con los tokens
 *  3. Llama a OpenAI con historial + nuevo mensaje
 *  4. Guarda respuesta del bot
 *  5. Devuelve ambos mensajes y uso de tokens (si disponible)
 */

// Carga perezosa de OpenAI para evitar fallar si no se usa este endpoint
let openaiClient: any = null;
function getOpenAI() {
  if (!openaiClient) {
    const OpenAI = require("openai").default;
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

const SYSTEM_PROMPT = `
Eres un asistente especializado en el mercado inmobiliario paraguayo.
Responde SIEMPRE en español, claro, conciso y útil.
Si faltan datos, pide aclaraciones.
Si el usuario pide recomendaciones de propiedades sin dar criterios suficientes,
pídele datos clave (ciudad,rango de precio,tipo de propiedad, alquiler/venta).
`.trim();

//BKP de sendandanswer
/*export const sendAndAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);
    const { contenido } = req.body;

    if (!contenido || typeof contenido !== "string") {
      res.status(400).json({ code:0, message: "Contenido requerido" });
      return;
    }

    // 1. Guardar mensaje del usuario
    const userMessage = await prisma.mensajes.create({
      data: {
        chat_id,
        contenido,
        tipo: "usuario"
      }
    });

    // 2. Obtener historial (incluyendo este). Orden ascendente.
    const historial = await prisma.mensajes.findMany({
      where: { chat_id },
      orderBy: { fecha: "asc" }
    });

    // Limitar a últimos 10 (ajusta si quieres)
    const last = historial.slice(-10);

    // 3. Mapear a formato OpenAI
    const mapped = last.map(m => ({
      role: m.tipo === "usuario" ? "user" : "assistant",
      content: m.contenido
    }));

    const openai = getOpenAI();

    // 4. Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
      temperature: Number(process.env.OPENAI_TEMPERATURE || 0.2),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...mapped
      ]
    });

    const answer: string = completion.choices[0]?.message?.content || "No pude generar respuesta.";

    // 5. Guardar respuesta del bot
    const botMessage = await prisma.mensajes.create({
      data: {
        chat_id,
        contenido: answer,
        tipo: "bot"
      }
    });

    // 6. Armar respuesta
    res.status(201).json({
      code: 1,
      message: "Mensaje procesado",
      data: {
        userMessage,
        botMessage,
        usage: completion.usage ? {
          prompt_tokens: completion.usage.prompt_tokens,
          completion_tokens: completion.usage.completion_tokens,
          total_tokens: completion.usage.total_tokens
        } : null
      }
    });

  } catch (error: any) {
    console.error("Error en sendAndAnswer:", error?.message || error);
    res.status(500).json({ code:0, message: "Error interno del servidor" });
  }
};
*/

export const sendAndAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat_id = parseInt(req.params.id);
    const { contenido } = req.body;

    if (!contenido || typeof contenido !== "string") {
      res.status(400).json({ code: 0, message: "Contenido requerido" });
      return;
    }

    // 1. Guardar mensaje del usuario
    const userMessage = await prisma.mensajes.create({
      data: { chat_id, contenido, tipo: "usuario" }
    });

    /* =========================================================
       BLOQUE DEMO ESTÁTICO (para pruebas de UI de recomendaciones)
       - Siempre devuelve un set fijo de propiedades.
       - Quitar o cambiar la condición "if (true)" para desactivar.
       ========================================================= */
    if (true) {
      const fakeSql = "SELECT * FROM propiedades";
      const fakeRows = [
        {
          id: 101,
          titulo: "Depto moderno 2D en Asunción",
          precio: 2500000,
          ciudad: "Asunción",
          zona: "Pinoza",
          tipo_propiedad: "departamento",
          trans_type: "alquiler",
          dormitorios: 2,
          banos: 2,
          garajes: 1,
          url: "https://example.com/prop/101",
          image_url: "https://via.placeholder.com/300x180?text=Depto+101"
        },
        {
          id: 102,
          titulo: "Depto céntrico 3D con balcón",
          precio: 3200000,
          ciudad: "Asunción",
          zona: "Centro",
          tipo_propiedad: "departamento",
          trans_type: "alquiler",
          dormitorios: 3,
          banos: 2,
          garajes: 0,
          url: "https://example.com/prop/102",
          image_url: "https://via.placeholder.com/300x180?text=Depto+102"
        },
        {
          id: 103,
          titulo: "Casa luminosa 4D con patio",
            precio: 580000000,
          ciudad: "Asunción",
          zona: "Mburucuyá",
          tipo_propiedad: "casa",
          trans_type: "venta",
          dormitorios: 4,
          banos: 3,
          garajes: 2,
          url: "https://example.com/prop/103",
          image_url: "https://via.placeholder.com/300x180?text=Casa+103"
        }
      ];

      const resumen = `Demo: te muestro ${fakeRows.length} propiedades de ejemplo. (Respuesta estática de pruebas.)`;

      const botMessage = await prisma.mensajes.create({
        data: { chat_id, contenido: resumen, tipo: "bot" }
      });

      res.status(201).json({
        code: 1,
        message: "Demo estático",
        data: {
          userMessage,
          botMessage,
          propertiesPayload: fakeRows,
          sql: fakeSql,
          rowCount: fakeRows.length
        }
      });
      return; // importante: no seguir al flujo OpenAI
    }
    /* ================== FIN BLOQUE DEMO ESTÁTICO ================== */

    // (El resto de tu lógica original queda aquí para cuando quites el demo)

    // 2. Obtener historial (incluyendo este). Orden ascendente.
    const historial = await prisma.mensajes.findMany({
      where: { chat_id },
      orderBy: { fecha: "asc" }
    });

    // Limitar a últimos 10
    const last = historial.slice(-10);

    // 3. Mapear a formato OpenAI
    const mapped = last.map(m => ({
      role: m.tipo === "usuario" ? "user" : "assistant",
      content: m.contenido
    }));

    const openai = getOpenAI();

    // 4. Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
      temperature: Number(process.env.OPENAI_TEMPERATURE || 0.2),
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...mapped]
    });

    const answer: string = completion.choices[0]?.message?.content || "No pude generar respuesta.";

    // 5. Guardar respuesta del bot
    const botMessage = await prisma.mensajes.create({
      data: { chat_id, contenido: answer, tipo: "bot" }
    });

    // 6. Respuesta final (modo normal)
    res.status(201).json({
      code: 1,
      message: "Mensaje procesado",
      data: {
        userMessage,
        botMessage,
        usage: completion.usage
          ? {
              prompt_tokens: completion.usage.prompt_tokens,
              completion_tokens: completion.usage.completion_tokens,
              total_tokens: completion.usage.total_tokens
            }
          : null
      }
    });
  } catch (error: any) {
    console.error("Error en sendAndAnswer:", error?.message || error);
    res.status(500).json({ code: 0, message: "Error interno del servidor" });
  }
};