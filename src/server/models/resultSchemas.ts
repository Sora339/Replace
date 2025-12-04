import z from "zod";

export const resultSchema = z.object({
    userId: z.string(),
    cycle: z.number(),
    code: z.string(),
});

export type GameResult = z.infer<typeof resultSchema>;
