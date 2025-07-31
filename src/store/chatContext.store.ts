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
          content:
            "Eres un asistente inmobiliario para Paraguay. " +
            "Tu meta es obtener los datos obligatorios (transaction, property_type, city). " +
            "Cuando los tengas, responde usando la función property_search_ready en JSON."
        }
      ]
    });
  }
  return ctxMap.get(sessionId)!;
}

/** Sobrescribe / persiste el contexto de una sesión */
export function saveContext(sessionId: string, ctx: ChatContext) {
  ctxMap.set(sessionId, ctx);
}
