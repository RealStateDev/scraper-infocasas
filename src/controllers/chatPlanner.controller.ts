// src/controllers/chatPlanner.controller.ts
import { RequestHandler } from "express";
import { askChatPlanner } from "../services/chatPlanner.service";
import {
  appendAssistantMessage,
  appendUserMessage
} from "../services/chatHistory.service";
import { getContext } from "../store/chatContext.store";
import { PropertySearchSlots } from "../types/PropertySearchSlots";

export const postMessage = async (req:any, res:any, next:any) => {
  try {
    const { sessionId, text } = req.body as {
      sessionId: string;
      text: string;
    };

    if (!sessionId || !text) {
      return res
        .status(400)
        .json({ error: "sessionId y text son obligatorios" });
    }

    // 1) Guardar mensaje usuario
    appendUserMessage(sessionId, text);

    // 2) Llamar a GPT-planner
    const ctx = getContext(sessionId);
    const choice = await askChatPlanner(ctx.messages);

    // 3) Evaluar respuesta
    if (choice.finish_reason === "tool_calls") {
      const argsStr =
        choice.message.tool_calls?.[0]?.function.arguments ?? "{}";
      const slots = JSON.parse(argsStr) as PropertySearchSlots;

      appendAssistantMessage(sessionId, null, {
        name: "property_search_ready",
        args: argsStr
      });
      ctx.slots = slots;

      res.json({ type: "slots_ready", slots });
      return;
    }

    const content = choice.message.content ?? "";
    appendAssistantMessage(sessionId, content);
    res.json({ type: "assistant_message", content });
  } catch (err) {
    next(err);
  }
};
