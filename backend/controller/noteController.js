import db from "../db.js";

const createNote = async (req,res) => {
    try {
        const user_id = req.user.id;
        const {note} = req.body;
        const date = new Date();
        if(!note || note.trim() === ""){
            return res.status(400).json({message:"Note is required"});
        }
        await db.query("insert into notes (user_id, note, date) values(?,?,?)",[user_id,note,date]);
        res.status(200).json({message: "Note uploaded successfully"})
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

const getAllNotes = async (req,res) => {
    try {
        const user_id = req.user.id;
        const [notes] = await db.query("select * from notes where user_id = ? order by date desc", [user_id]);
        res.status(200).json(notes)
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

const updateNote = async (req,res) => {
    try {
        const {note} = req.body;
        const user_id = req.user.id;
        const note_id = req.params.id;
        if(!note || note.trim() === ""){
            return res.status(400).json({message:"Note is required"});
        }
        const [result] = await db.query("update notes set note = ? where user_id = ? and note_id = ?", [note,user_id,note_id]);
        if(result.affectedRows === 0) {
            return res.status(404).json({message: "Note not found"})
        }
        res.status(201).json({message: "Note updated successfully"})
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

const deleteNote = async (req,res) => {
    try {
        const user_id = req.user.id;
        const note_id = req.params.id;
        const [result] =  await db.query("delete from notes where user_id = ? and note_id = ?", [user_id,note_id]);
        if(result.affectedRows === 0) {
            return res.status(404).json({message: "Note not found"})
        }
        res.status(200).json({message: "Note deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
}

export { createNote,getAllNotes,updateNote,deleteNote };