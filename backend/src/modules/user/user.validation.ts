import { z } from "zod";

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();
const stripControlChars = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, "");

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .transform((value) => normalizeWhitespace(stripControlChars(value)))
      .pipe(z.string().min(2).max(100)),
    email: z
      .string()
      .transform((value) => normalizeWhitespace(stripControlChars(value)).toLowerCase())
      .pipe(z.string().email().max(254)),
    password: z.string().min(8).max(128),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z
      .string()
      .transform((value) => normalizeWhitespace(stripControlChars(value)).toLowerCase())
      .pipe(z.string().email().max(254)),
    password: z.string().min(1).max(128),
  })
  .strict();

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;

