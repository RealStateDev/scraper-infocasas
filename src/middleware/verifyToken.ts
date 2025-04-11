import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "Token requerido" });
      return; // 👈 IMPORTANTE: retornar para evitar seguir
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({ message: "Token inválido" });
        return; // 👈 también retorna
      }

      req.user = decoded as JwtPayload;
      next(); // sigue la cadena
    });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar el token" });
  }
};
