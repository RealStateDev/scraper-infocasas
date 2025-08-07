import { fromTextToSql } from "./sqlcoder.service";          
import { PropertySearchSlots } from "../types/PropertySearchSlots";
import { buildSqlPrompt } from "./sqlcoderPrompt.service";

/**
 * Genera la consulta SQL usando SQLCoder.
 */
export async function generateSql(slots: PropertySearchSlots): Promise<string> {
  const prompt = buildSqlPrompt(slots);

  // Llamar al endpoint FastAPI → fromTextToSql
  const sql = await fromTextToSql(prompt);

  if (!sql.toLowerCase().startsWith("select")) {
    throw new Error("SQLCoder no devolvió una sentencia SELECT válida");
  }
  return sql;
}
