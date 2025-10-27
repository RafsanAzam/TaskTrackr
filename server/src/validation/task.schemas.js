import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(140),
    description: z.string().max(1000).optional().default(""),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().datetime().optional().nullable()
});

export const updateTaskSchema = createTaskSchema.partial(); // all fields optional