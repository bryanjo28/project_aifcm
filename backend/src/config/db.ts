import { env } from "./env.js";
import { connectMySql } from "./mysql.js";

export const connectDB = async () => {
  try {
    await connectMySql();
    console.log(`MySQL connected: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
