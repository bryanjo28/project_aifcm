import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { v1Routes } from "./routes/v1.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb", strict: true, type: "application/json" }));
app.use(express.urlencoded({ extended: false, limit: "10kb", parameterLimit: 20 }));
app.use(morgan("dev"));

app.use("/api/v1", v1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
