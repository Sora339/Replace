import { Context } from "hono";
import { db } from "@/src/db";
import { gameResults } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export const getUserGameResults = async (c: Context) => {
    // Assuming userId is passed as query param for now
    const userId = c.req.query("userId");

    if (!userId) {
        return c.json({ error: "UserId is required" }, 400);
    }

    const results = await db.select()
        .from(gameResults)
        .where(eq(gameResults.userId, userId))

    return c.json(results);
};

