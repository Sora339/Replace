"use server"

import { auth } from "@/src/auth"
import { db } from "@/src/db"
import { gameResults } from "@/src/db/schema"

export const recordGameResult = async (cycle: number, code: string) => {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Not authenticated")
    }

    const result = await db.insert(gameResults).values({
        userId: session.user.id,
        cycle,
        code,
    }).returning()

    return result[0]
}
