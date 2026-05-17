import express from "express"
import dotenv from "dotenv"
import "./config/env.js"
import db from "./db.js"
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || origin.endsWith(".pages.dev") || origin === "https://note-app-eks.pages.dev") {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
    console.log (`server running on port http://localhost:${PORT}`)
})