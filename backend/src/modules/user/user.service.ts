import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getMySqlPool, type MySqlUserRow } from "../../config/mysql.js";
import type {
  ForgotPasswordEmailInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
} from "./user.validation.js";

type ServiceError = Error & { statusCode?: number };
export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

function createServiceError(message: string, statusCode: number): ServiceError {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, savedHash] = storedPassword.split(":");
  if (!salt || !savedHash) {
    return false;
  }

  const hashedBuffer = scryptSync(password, salt, 64);
  const savedHashBuffer = Buffer.from(savedHash, "hex");

  if (hashedBuffer.length !== savedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashedBuffer, savedHashBuffer);
}

function mapMySqlUser(user: MySqlUserRow): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.is_active),
  };
}

export const createUser = async (data: RegisterUserInput): Promise<PublicUser> => {
  const pool = getMySqlPool();
  const [existingRows] = await pool.query<MySqlUserRow[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [data.email]
  );

  if (existingRows.length > 0) {
    throw createServiceError("Email sudah terdaftar.", 409);
  }

  const passwordHash = hashPassword(data.password);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, is_active)
     VALUES (?, ?, ?, 'user', true)`,
    [data.name, data.email, passwordHash]
  );

  const insertResult = result as { insertId: number };

  return {
    id: insertResult.insertId,
    name: data.name,
    email: data.email,
    role: "user",
    isActive: true,
  };
};

export const findUserByEmail = async (email: string): Promise<MySqlUserRow | null> => {
  const pool = getMySqlPool();
  const [rows] = await pool.query<MySqlUserRow[]>(
    "SELECT id, name, email, password, role, is_active FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] ?? null;
};

export const loginUser = async (payload: LoginUserInput): Promise<PublicUser> => {
  const user = await findUserByEmail(payload.email);

  if (!user || !Boolean(user.is_active)) {
    throw createServiceError("Email atau password salah.", 401);
  }

  const isValidPassword = verifyPassword(payload.password, user.password);
  if (!isValidPassword) {
    throw createServiceError("Email atau password salah.", 401);
  }

  return mapMySqlUser(user);
};

export const checkEmailForForgotPassword = async (
  payload: ForgotPasswordEmailInput
): Promise<{ email: string; found: boolean }> => {
  const user = await findUserByEmail(payload.email);
  return {
    email: payload.email,
    found: Boolean(user),
  };
};

export const resetPasswordByEmail = async (
  payload: ResetPasswordInput
): Promise<{ email: string }> => {
  const user = await findUserByEmail(payload.email);

  if (!user || !Boolean(user.is_active)) {
    throw createServiceError("Email tidak ditemukan.", 404);
  }

  const nextPasswordHash = hashPassword(payload.newPassword);
  const pool = getMySqlPool();

  await pool.query("UPDATE users SET password = ? WHERE id = ? LIMIT 1", [
    nextPasswordHash,
    user.id,
  ]);

  return { email: payload.email };
};

export const getUserProfile = async (id: string | number): Promise<PublicUser | null> => {
  const mysqlId = Number(id);
  if (!Number.isFinite(mysqlId)) {
    return null;
  }

  const pool = getMySqlPool();
  const [rows] = await pool.query<MySqlUserRow[]>(
    "SELECT id, name, email, role, is_active FROM users WHERE id = ? LIMIT 1",
    [mysqlId]
  );

  const user = rows[0];
  if (!user) {
    return null;
  }

  return mapMySqlUser(user);
};

export const getAllUsers = async (): Promise<PublicUser[]> => {
  const pool = getMySqlPool();
  const [rows] = await pool.query<MySqlUserRow[]>(
    "SELECT id, name, email, role, is_active FROM users ORDER BY created_at DESC"
  );

  return rows.map((user) => mapMySqlUser(user));
};
