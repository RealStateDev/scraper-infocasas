/*
esto convierte una pregunta en lenguaje natural a SQL (SELECT) usando el endpoint SQLCoder.
*/
const BASE_URL = process.env.SQLCODER_BASE_URL || "http://192.168.0.3:8000";

export async function fromTextToSql(question: string): Promise<string> {
  if (!question || typeof question !== "string") {
    throw new Error("La pregunta (question) es requerida");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/generate-sql/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch (e: any) {
    console.error("[fromTextToSql] Error de red:", e.message);
    throw new Error("No se pudo conectar al servicio SQLCoder");
  }

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("Error de validación en el servicio del modelo (422)");
    }
    const textErr = await safeReadText(response);
    console.error("[fromTextToSql] Respuesta no OK:", response.status, textErr);
    throw new Error("Error llamando al servicio SQLCoder");
  }

  // La respuesta es un string puro (ej: "SELECT ...")
  const rawText = await safeReadText(response);

  if (typeof rawText !== "string" || rawText.length === 0) {
    throw new Error("Formato inesperado: la API no devolvió un string");
  }

  const sanitized = sanitizeSql(rawText);
  const withLimit = ensureLimit(sanitized, 50);
  return withLimit;
}

/* -------- Helpers -------- */

async function safeReadText(r: Response): Promise<string> {
  try {
    return await r.text();
  } catch {
    return "";
  }
}

function sanitizeSql(sql: string): string {
  let s = sql.trim();

  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }

  s = s.replace(/;+\s*$/g, "");

  if (s.includes(";")) {
    throw new Error("SQL inválido: múltiples sentencias detectadas");
  }

  const withoutComments = s.replace(/^\/\*[\s\S]*?\*\/\s*/g, "").trim();
  if (!withoutComments.toUpperCase().startsWith("SELECT")) {
    throw new Error("Solo se permiten sentencias SELECT");
  }

  const upper = s.toUpperCase();
  const forbidden = [
    " UPDATE ",
    " DELETE ",
    " INSERT ",
    " DROP ",
    " ALTER ",
    " TRUNCATE ",
    " CREATE ",
    " GRANT ",
    " REVOKE "
  ];
  if (forbidden.some(f => upper.includes(f))) {
    throw new Error("Operación no permitida en SQL generado");
  }

  return s;
}

function ensureLimit(sql: string, defaultLimit: number): string {
  if (/LIMIT\s+\d+/i.test(sql)) return sql;
  return `${sql} LIMIT ${defaultLimit}`;
}