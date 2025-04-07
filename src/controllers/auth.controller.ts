import { Request, Response } from "express";
import { register, login } from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
