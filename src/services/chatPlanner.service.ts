import { OpenAI } from "openai";
import { ChatCompletionTool } from "openai/resources/index";

// 1) Instancia global — evita recrearla en cada request
export const openai = new OpenAI({
  //apiKey: process.env.OPENAI_API_KEY
  apiKey: "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"
});

// 2) Definición de la única “function”
export const slotTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "property_search_ready",
    description:
      "Usa esta función SOLO cuando ya conozcas todos los criterios " +
      "obligatorios para lanzar la búsqueda de propiedades.",
    parameters: {
      type: "object",
      properties: {
        transaction: {
          type: "string",
          enum: ["venta", "alquiler"],
          description: "Tipo de transacción. NO puede ser null. Si no lo sabes todavía, pregunta."
  },
        property_type: {
          type: "string",
          enum: [
            "casas",
            "departamentos",
            "terrenos",
            "locales-comerciales",
            "oficinas",
            "chacras-o-campos",
            "duplex",
            "edificios-u-hoteles"
          ]
        },
        city: { type: "string", description: "Ciudad de Paraguay" },
        price_min: { type: "number", nullable: true },
        price_max: { type: "number", nullable: true },
        bedrooms: { type: "integer", nullable: true }
      },
      required: ["transaction", "property_type", "city"]
    }
  }
};

// 3) Utilidad para preguntar al modelo “planner”
export async function askChatPlanner(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  model = "gpt-4.1-nano" 
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    tools: [slotTool],
    temperature: 0.3,
    //response_format: { type: "json_object" }
  });

  return completion.choices[0]; // devolvemos solo la primera choice
}
