import prisma from "../prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";


const SALT_ROUNDS = 10;

interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  genero: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async ({ nombre, email, password, fecha_nacimiento,genero }: RegisterInput) => {
  const existingUser = await prisma.usuarios.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("El correo ya está registrado.");
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prisma.usuarios.create({
    data: { nombre, email, password_hash, fecha_nacimiento,genero },
  });

  return { message: "Usuario registrado correctamente", userId: newUser.id };
};

export const login = async ({ email, password }: LoginInput) => {
    const user = await prisma.usuarios.findUnique({ where: { email } });
  
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
  
    const validPassword = await bcrypt.compare(password, user.password_hash);
  
    if (!validPassword) {
      throw new Error("Contraseña incorrecta.");
    }
  
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
  
    return {
      message: "Login exitoso",
      userId: user.id,
      nombre: user.nombre,
      token,
    };
  };
  
