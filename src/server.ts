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
import subsRoutes from "./routes/subs.routes"
import nl2sqlRoutes from "./routes/nl2sql.routes";
import openaiChatRoutes from "./routes/openaiChat.routes";
import intentRoutes from "./routes/intentRoutes";



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
app.use("/api", subsRoutes);
app.use("/api", nl2sqlRoutes);
app.use("/api", openaiChatRoutes);
app.use("/api", intentRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
