// src/services/chatHistory.service.ts
import { getContext, saveContext } from "../store/chatContext.store";

export function appendUserMessage(sessionId: string, text: string) {
  const ctx = getContext(sessionId);
  ctx.messages.push({ role: "user", content: text });
  saveContext(sessionId, ctx);
}

export function appendAssistantMessage(
  sessionId: string,
  content: string | null,
  toolCall?: { name: string; args: string }
) {
  const ctx = getContext(sessionId);
  if (toolCall) {
    ctx.messages.push({
      role: "assistant",
      content,
      tool_calls: [
        {
          id: "call_dummy",
          type: "function",
          function: { name: toolCall.name, arguments: toolCall.args }
        }
      ]
    } as any);
  } else {
    ctx.messages.push({ role: "assistant", content: content ?? "" });
  }
  saveContext(sessionId, ctx);
}
