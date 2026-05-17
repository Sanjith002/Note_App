import express from "express"
import auth from "../middleware/auth.js"
import { createNote,getAllNotes,updateNote,deleteNote } from "../controller/noteController.js";

const router = express.Router();

router.post("/", auth, createNote)
router.get("/", auth, getAllNotes)
router.put("/:id", auth, updateNote)
router.delete("/:id", auth, deleteNote)

export default router;