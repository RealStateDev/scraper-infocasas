/*
envía un mensaje del usuario a OpenAI con un prompt de sistema (enfoque inmobiliario Paraguay) 
y devuelve la respuesta en texto.
*/

import { openai, OPENAI_MODEL, OPENAI_TEMPERATURE } from "./openai.client";

export async function simpleAskOpenAI(userMessage: string): Promise<string> {
  // Mensaje del sistema (rol)
  const systemPrompt = 
  `
    Eres un asistente especializado en el mercado inmobiliario paraguayo.
    Responde SIEMPRE en español, claro, conciso y útil.
    Si faltan datos, pide aclaraciones.
    Si el usuario pide recomendaciones de propiedades sin dar criterios suficientes,
    pídele datos clave (ciudad,rango de precio,tipo de propiedad, alquiler/venta).
    `.trim();

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });

  return response.choices[0].message?.content || "";
}