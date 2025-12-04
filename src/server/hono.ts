import { Hono } from "hono";
import { gameRoutes } from "./routes/game";
import { myPageRoutes } from "./routes/myPage";

export const app = new Hono().basePath("/api");
export const game = app.route("/game", gameRoutes);
export const myPage = app.route("/mypage", myPageRoutes);
