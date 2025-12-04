import z from "zod";

export const resultSchema = z.object({
    cycle: z.number(),
    code: z.string(),
});

export type GameResult = z.infer<typeof resultSchema>;
