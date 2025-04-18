import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scrapingRoutes from "./routes/scraping.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import propiedadesRoutes from "./routes/propiedades.routes";
import favoritosRoutes from "./routes/favoritos.routes";
import busquedasRouter from "./routes/busquedas.routes";
import chatRoutes from "./routes/chat.routes";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/scraping", scrapingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", propiedadesRoutes);
app.use("/api", favoritosRoutes);
app.use("/api", busquedasRouter);
app.use("/api", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
