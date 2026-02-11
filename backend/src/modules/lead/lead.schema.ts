import { z } from "zod";

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();
const stripControlChars = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, "");

export const createLeadSchema = z.object({
  email: z
    .string()
    .transform((value) => normalizeWhitespace(stripControlChars(value)).toLowerCase())
    .pipe(z.string().email().max(254)),
  name: z
    .string()
    .transform((value) => normalizeWhitespace(stripControlChars(value)))
    .pipe(z.string().min(2).max(100))
    .optional(),
}).strict();

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
