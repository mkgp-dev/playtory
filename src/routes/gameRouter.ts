import { Router } from "express";
import { game_create, game_delete, game_detail, game_edit, game_form, game_list, game_update } from "../controllers/gameController";

const gameRouter = Router();

gameRouter.get("/", game_list);
gameRouter.get("/create", game_form);
gameRouter.post("/create", game_create);
gameRouter.get("/:id", game_detail);
gameRouter.get("/:id/edit", game_edit);
gameRouter.post("/:id/edit", game_update);
gameRouter.post("/:id/delete", game_delete);

export default gameRouter;