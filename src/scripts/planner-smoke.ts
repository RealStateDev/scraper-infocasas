// scripts/planner-smoke.ts
import { askChatPlanner } from "../services/chatPlanner.service";

(async () => {
  const res = await askChatPlanner([
    {
      role: "system",
      content:
        "Eres un asistente inmobiliario para Paraguay. " +
        "Usa la función property_search_ready cuando tengas todos los datos obligatorios." +
        "⚠️ Devuelve la función como un **JSON** válido."
    },
    { role: "user", content: "Quiero comprar un departamento en Asunción por 100 mil dólares" }
  ]);

  console.log(JSON.stringify(res, null, 2));
})();
