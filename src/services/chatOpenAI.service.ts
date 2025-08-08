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



/*
Aca hay que mejorar dos cosas muy importantes para que funcione como debe, 
primero el prompt hay que hacerlo mas especifico y ajustado a lo que se necesita.

y el segundo es que para que el gpt haga bien su trabajo de ser muy inteligente, o sea
debes poner uno de los modelos mas potentes de openai, porque sino, no va a resumir bien

ahora mismo genera esto: (3 habitaciones en luque un derpamento para alquilar)

`Entendido. Aquí tienes el prompt basado en la conversación:

---

Eres un asistente de recomendación de propiedades inmobiliarias en Paraguay. El usuario busca alquilar un departamento en Luque que tenga exactamente 3 habitaciones. No tiene un rango de precio específico ni otras preferencias adicionales. Genera una consulta que devuelva propiedades que cumplan con estos criterios: ubicación en Luque, tipo de propiedad: departamento, modalidad: alquiler, número de habitaciones: 3. No incluyas filtros adicionales a menos que sean mencionados explícitamente por el usuario.

---

¿Quieres que te ayude a convertir este prompt en una consulta SQL?`


el query que devolvio: "SELECT * FROM public.propiedades p WHERE p.zona ilike '%Luque%' AND p.tipo_propiedad ilike '%departamento%' AND p.trans_type ilike '%alquiler%' AND p.dormitorios = 3;"
*/
export async function resumeConversationAndGeneratePrompt(messages: { role: "user" | "assistant" | "system"; content: string }[]): Promise<string> {
  // Mensaje del sistema (rol)
  //mejorar este prompt, pero hacerlo super bien
  const systemPrompt = 
  `
    Eres un asistente que va a tomar esta conversacion y realizar un prompt que luego va
    tomar otro modelo de lenguaje y lo va a convertir en sql.

    Necesito que generes un prompt lo mas fiel a lo ultimo que se mensiona en la conversacion para devolver las propiedades deseadas
    ya que el sistema en el que estas es una aplicacion de recomendacion de propiedades inmobiliarias.
    `.trim();

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    messages: [
      ...(messages.slice(1, messages.length)),
      { role: "system", content: systemPrompt }
    ]
  });

  return response.choices[0].message?.content || "";
}