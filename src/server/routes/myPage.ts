import { Hono } from "hono";
import { getUserGameResults } from "../controllers/getResult";

export const myPageRoutes = new Hono()
    .get("/results", getUserGameResults);
