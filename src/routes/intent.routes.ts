import { Router, Request, Response } from "express";

// Temporal in-memory store
const storedIntents: any[] = [];

const router = Router();

router.post("/intent", (req: Request, res: Response): void => {
  const { ready, intent, entidades } = req.body;

  if (ready !== true) {
    res.status(400).json({ success: false, error: "'ready' must be true" });
    return;
  }

  const payload = { ready, intent, entidades };
  console.log("[/intent] Received payload:", payload);
  storedIntents.push(payload);

  res.json({ status: "stored" });
});

export default router;
export { storedIntents };
