import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { UserModel } from "./user.schema.js";
import type { LoginUserInput, RegisterUserInput } from "./user.validation.js";

type ServiceError = Error & { statusCode?: number };
export type PublicUser = {
  id: string;
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
    // Backward compatibility for legacy plain-text records.
    return storedPassword === password;
  }

  const hashedBuffer = scryptSync(password, salt, 64);
  const savedHashBuffer = Buffer.from(savedHash, "hex");

  if (hashedBuffer.length !== savedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashedBuffer, savedHashBuffer);
}

export const createUser = async (data: RegisterUserInput) => {
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw createServiceError("Email sudah terdaftar.", 409);
  }

  const createdUser = await UserModel.create({
    ...data,
    password: hashPassword(data.password),
  });

  return {
    id: createdUser._id.toString(),
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
    isActive: createdUser.isActive,
  } satisfies PublicUser;
};

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const loginUser = async (payload: LoginUserInput) => {
  const user = await UserModel.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw createServiceError("Email atau password salah.", 401);
  }

  const isValidPassword = verifyPassword(payload.password, user.password);
  if (!isValidPassword) {
    throw createServiceError("Email atau password salah.", 401);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  } satisfies PublicUser;
};

export const getUserProfile = async (id: string): Promise<PublicUser | null> => {
  const user = await UserModel.findById(id).select("name email role isActive");
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

export const getAllUsers = async () => {
  return UserModel.find().select("-password");
};
