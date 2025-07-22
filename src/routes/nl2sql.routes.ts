/*
recibe { question }, genera el SQL usando fromTextToSql y lo devuelve.
solo sirve para probar la traducción texto → SQL. No ejecuta el query.
*/
import { Router, Request, Response, NextFunction } from "express";
import { fromTextToSql } from "../services/sqlcoder.service";

const router = Router();

router.post(
  "/nl2sql",
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ success: false, error: "Falta 'question' en el body" });
      return;
    }
    try {
      const sql = await fromTextToSql(question);
      res.json({ success: true, sql });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
);

export default router;
