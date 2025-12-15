'use server';

import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { gameResults } from "@/src/db/schema";
import type { Context } from "hono";
import { eq } from "drizzle-orm";

export const getLatestSave = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    return db.query.gameResults.findFirst({
        where: (results, { eq }) => eq(results.userId, userId),
        orderBy: (results, { desc }) => [desc(results.createdAt)],
    });
};

export const getUserGameResults = async (c: Context) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return c.json({ error: "Not authenticated" }, 401);
    }

    const limitParam = Number(c.req.query("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 50)
        : 3;

    const results = await db.query.gameResults.findMany({
        where: eq(gameResults.userId, userId),
        orderBy: (results, { desc }) => [desc(results.createdAt)],
        limit,
    });

    return c.json({ results });
};
