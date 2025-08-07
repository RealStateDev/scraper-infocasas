// src/store/chatContext.store.ts
import { PropertySearchSlots } from "../types/PropertySearchSlots";

type MsgRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: MsgRole;
  content: string;
  // Almacena tool_calls si quieres reenviar todo a GPT luego
  tool_calls?: any;
}

interface ChatContext {
  messages: ChatMessage[];
  slots?: PropertySearchSlots; // aparece cuando la búsqueda ya está lista
}

/** Mapa in-memory ‹sessionId → ChatContext› */
const ctxMap = new Map<string, ChatContext>();

/**
 * Devuelve el contexto de una sesión; si no existía, lo inicializa
 * con el mensaje system base.
 */
export function getContext(sessionId: string): ChatContext {
  if (!ctxMap.has(sessionId)) {
    ctxMap.set(sessionId, {
      messages: [
        {
          role: "system",
          content:` 
          Eres un asistente especializado en el mercado inmobiliario paraguayo.
          Habla SIEMPRE en español claro y conciso.
          Flujo:
          1. Saluda brevemente (no pidas datos aún).
          2. Cuando el usuario muestre interés, recopila
          — transacción (venta / alquiler)
          — tipo de propiedad
          — ciudad
          — (opcional) rango de precio, dormitorios…
          Pregunta sólo lo que falte; una pregunta a la vez.
          3. Cuando tengas TODOS los campos obligatorios,
          llama a la función property_search_ready con los valores exactos.
          `.trim()
        }
      ]
    });
  }
  return ctxMap.get(sessionId)!;
}
/* 
Este content hace que:Si el usuario dice “Hola” -> responde algo amistoso (“¡Hola! ¿Cómo puedo ayudarte hoy?”). 
Recién pedirá datos cuando el usuario muestre intención (ej.: “busco un depto…”).
*/

/** Sobrescribe / persiste el contexto de una sesión */
export function saveContext(sessionId: string, ctx: ChatContext) {
  ctxMap.set(sessionId, ctx);
}
