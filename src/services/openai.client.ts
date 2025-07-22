/*
inicializa el cliente de OpenAI con la API key de .env
*/
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-4.1-nano";
export const OPENAI_TEMPERATURE =
  Number(process.env.OPENAI_TEMPERATURE ?? 0.2);