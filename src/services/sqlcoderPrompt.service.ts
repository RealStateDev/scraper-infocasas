// src/services/sqlcoderPrompt.service.ts
import { PropertySearchSlots } from "../types/PropertySearchSlots";

const COL_MAP: Record<string, string> = {
  transaction: "trans_type",
  property_type: "tipo_propiedad",
  city: "ciudad",
};

export function buildSqlPrompt(slots: PropertySearchSlots, extra?: string) {
  const conds: string[] = [];

  Object.entries(slots).forEach(([key, val]) => {
    if (val == null) return;

    const col = COL_MAP[key] ?? key; // ← usa alias si existe

    switch (key) {
      case "price_min":
        conds.push(`precio >= ${val}`);
        break;
      case "price_max":
        conds.push(`precio <= ${val}`);
        break;
      case "bedrooms":
        conds.push(`dormitorios >= ${val}`);
        break;
      default:
        if (typeof val === "boolean")
          conds.push(`${col} = ${val ? "true" : "false"}`);
        else conds.push(`${col} = '${val}'`);
    }
  });

  return `
Eres un modelo que genera SQL para PostgreSQL.

Genera UNA sola sentencia SELECT:
SELECT * FROM propiedades
WHERE ${conds.join(" AND ")};

${extra ? `-- contexto extra: ${extra.replace(/\n+/g, " ")}` : ""}
Devuelve sólo la consulta.`;
}