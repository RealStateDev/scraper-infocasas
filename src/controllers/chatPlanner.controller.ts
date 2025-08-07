import { askChatPlanner } from "../services/chatPlanner.service";
import { appendAssistantMessage, appendUserMessage } from "../services/chatHistory.service";
import { getContext } from "../store/chatContext.store";
import { PropertySearchSlots } from "../types/PropertySearchSlots";
import { buildSqlPrompt } from "../services/sqlcoderPrompt.service";   // ← NUEVO
import { fromTextToSql } from "../services/sqlcoder.service";
import prisma from "../prisma";

export const postMessage = async (req: any, res: any, next: any) => {
  try {
    const { sessionId, text } = req.body as { sessionId: string; text: string };

    if (!sessionId || !text) {
      return res.status(400).json({ error: "sessionId y text son obligatorios" });
    }

    // 1) Guardar mensaje usuario
    appendUserMessage(sessionId, text);

    // 2) Llamar a GPT-planner
    const ctx = getContext(sessionId);
    const choice = await askChatPlanner(ctx.messages);

    // 3) Evaluar respuesta
    const isToolCall =
      choice.finish_reason === "tool_calls" &&
      choice.message.tool_calls?.[0]?.function.name === "property_search_ready";

    if (isToolCall) {
      /* --- slots --- */
      const argsStr = choice.message.tool_calls?.[0]?.function.arguments ?? "{}";
      const slots = JSON.parse(argsStr) as PropertySearchSlots;

      const missing = ["transaction", "property_type", "city"].filter(
        (k) => !slots[k as keyof typeof slots]
      );
      if (missing.length) {
        const followUp =
          "Para poder buscar necesito que me indiques: " + missing.join(", ");
        appendAssistantMessage(sessionId, followUp);
        return res.json({ type: "assistant_message", content: followUp });
      }

      /* Luego ese prompt que va a generar el gpt base, se lo vamos a pasar tal cual al sqlcoder 
      El sql coder nos va a retornar un query
      */
      const prompt = buildSqlPrompt(slots);
      let query = (await fromTextToSql(prompt)).trim();
      console.log("query", query);

      // La BD retorna los datos
      const properties = await prisma.$queryRawUnsafe<any[]>(query);

      if (properties.length === 0) {
        const noData =
          "No encontré propiedades con esos criterios. ¿Quieres ajustar la búsqueda?";
        appendAssistantMessage(sessionId, noData);
        return res.json({ type: "assistant_message", content: noData });
      }
      //Se retornan los datos para pintar las tarjetas
      return res.json({ type: "property_data", properties });
    }

    /* --- respuesta normal --- */
    const plain = choice.message.content ?? "";
    appendAssistantMessage(sessionId, plain);
    res.json({ type: "assistant_message", content: plain });
  } catch (err) {
    next(err);
  }
};
