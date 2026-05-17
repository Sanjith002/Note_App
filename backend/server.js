import express from "express"
import dotenv from "dotenv"
import "./config/env.js"
import db from "./db.js"
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
};

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
    console.log (`server running on port http://localhost:${PORT}`)
})