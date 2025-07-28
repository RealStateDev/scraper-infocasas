import { Router, Request, Response } from "express";

interface IntentPayload {
  ready: boolean;
  intent: string;
  entidades: {
    tipo_propiedad?: string;
    ciudad?: string;
    trans_type?: string;
    [key: string]: any;
  };
}

const storedIntents: IntentPayload[] = [];

const router = Router();

router.post("/intent", (req: Request, res: Response): void => {
  const { ready, intent, entidades } = req.body as IntentPayload;

  // validate ready flag
  if (ready !== true) {
    res.status(400).json({ error: "'ready' must be true" });
    return;
  }

  // basic entity validation
  const requiredFields = ["tipo_propiedad", "ciudad", "trans_type"];
  const missing = requiredFields.filter((field) => !(entidades && entidades[field]));
  if (missing.length) {
    res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    return;
  }

  const payload: IntentPayload = { ready, intent, entidades };
  console.log("[/intent] Received payload:", payload);
  storedIntents.push(payload);

  res.json({ status: "stored" });
});

export default router;
export { storedIntents, IntentPayload };
