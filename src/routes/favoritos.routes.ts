import { Router } from "express";
import { getAllFavorites, getFavoriteById, getFavoriteByUser, updateFavorite, createFavorite, deleteFavorite} from "../controllers/favoritos.controller";

const router = Router();

router.get("/favoritos", getAllFavorites);
router.get("/favoritos/:id", getFavoriteById);
router.get("/favoritosByUser/:userId", getFavoriteByUser);
router.put("/favoritos/:id", updateFavorite);
router.post("/favoritos", createFavorite);
router.delete("/favoritos/:id", deleteFavorite);

export default router;