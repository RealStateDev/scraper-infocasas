import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // asegúrate que no sea null
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

interface TokenPayload extends JwtPayload {
  userId: number;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn:  Number(JWT_EXPIRES_IN),
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
