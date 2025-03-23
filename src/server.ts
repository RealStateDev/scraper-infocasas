import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scrapingRoutes from "./routes/scraping.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/scraping", scrapingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
