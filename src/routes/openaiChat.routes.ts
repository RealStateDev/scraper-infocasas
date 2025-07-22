/*
recibe { message } y responde con texto generado por simpleAskOpenAI.
*/
import { Router, Request, Response } from "express";
import { simpleAskOpenAI } from "../services/chatOpenAI.service";

const router = Router();

/**
 * POST /api/chat/openai
 * Body: { message: "texto del usuario" }
 */
router.post("/chat/openai", async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ success: false, error: "Falta 'message'" });
    return;
  }

  try {
    const answer = await simpleAskOpenAI(message);
    res.json({ success: true, answer });
  } catch (e: any) {
    console.error("[/chat/openai] error:", e.message);
    res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;
