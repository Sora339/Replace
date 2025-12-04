import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { recordGameResult } from "../controllers/postResult";
import { resultSchema } from "../models/resultSchemas";

export const gameRoutes = new Hono()
    .post("/result", zValidator("json", resultSchema), async (c) => {
        const { cycle, code } = c.req.valid("json");
        try {
            const result = await recordGameResult(cycle, code);
            return c.json(result);
        } catch (e: any) {
            return c.json({ error: e.message }, 401);
        }
    });
