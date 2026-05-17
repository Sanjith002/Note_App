import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axios from "../api/axios";
import LoadingSpinner from "../common/LoadingSpinner";
import toast from "react-hot-toast";
import NoteSkeleton from "./NoteSkeleton";

const Dashboard = () => {
  const [note, setNote] = useState("");
  const [localError, setLocalError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [emptyEditError, setEmptyEditError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteErrorId, setDeleteErrorId] = useState(null);

  const queryClient = useQueryClient();

  const {mutate: postNote, isPending: isPosting, isError: isPostError, error: postError} = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/notes", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Note Created", {
        duration: 3000,
      });
      setNote("");
      queryClient.invalidateQueries({
        queryKey: ["allNotes"],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const {mutate: editNote, isPending: isEditing, isError: isEditError, error: editError} = useMutation({
    mutationFn: async ({ id, note }) => {
      const res = await axios.put(`/api/notes/${id}`, { note });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Note updated", {
        duration: 3000,
      });
      setEditingId(null);
      queryClient.invalidateQueries({
        queryKey: ["allNotes"],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const {mutate: deleteNote, error: deleteError} = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/notes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Note Deleted", {
        duration: 3000,
      });
      setDeletingId(null);
      setDeleteErrorId(null);
      queryClient.invalidateQueries({
        queryKey: ["allNotes"],
      });
    },
    onError: (error, variables) => {
      setDeletingId(null);
      setDeleteErrorId(variables);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmitNote = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setLocalError("Note cannot be empty");
      return;
    }
    postNote({ note });
  };

  const handleEditClick = (note) => {
    setEditingId(note.note_id);
    setEditText(note.note);
  };

  const handleUpdate = () => {
    if (!editText.trim()) {
      setEmptyEditError("Note cannot be empty")
      return;
    }

    editNote({ id: editingId, note: editText });
  };

  const handleDeleteNote = (note) => {
    setDeletingId(note.note_id);
    deleteNote(note.note_id);
  }

  const { data: notes, isLoading } = useQuery({
    queryKey: ["allNotes"],
    queryFn: async () => {
      const res = await axios.get("/api/notes");
      return res.data;
    },
    retry: false,
  });

  return (
    <div className=" h-screen bg-gray-100 text-black  ">
      <div className="px-[50px]">
        <div className="pt-[30px]">
          <p className="font-medium text-xl">CREATE NOTE</p>
          <form onSubmit={handleSubmitNote}>
            <div className="mt-[20px] text-black ">
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setLocalError("");
                }}
                placeholder="Create your note..."
                className="px-[15px] py-[10px] resize-none outline-none w-full  rounded-xl  bg-white mr-[20px] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                rows="6"
              ></textarea>
            </div>
            {localError && <p className="text-[#C10115]">{localError}</p>}
            {isPostError && (
              <p className="text-[#C10115]">
                {postError.response?.data?.message || "Something went wrong"}
              </p>
            )}
            <button
              type="submit"
              disabled={isPosting}
              className={`bg-black rounded-md mt-[15px] text-white px-[10px] h-[40px] ${isPosting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              {isPosting ? <LoadingSpinner size="sm" /> : "Create Note"}
            </button>
          </form>
        </div>
        <div className="flex flex-col pb-[30px]">
          <p className="font-medium text-xl mt-[25px]">MY NOTES</p>
          {isLoading ? (
            <>
              <NoteSkeleton />
              <NoteSkeleton />
              <NoteSkeleton />
              <NoteSkeleton />
            </>
          ) : notes.length === 0 ? (
            <p className="mt-[20px] h-[200px] flex justify-center items-center text-center text-gray-500 font-medium">
              No Notes Created
            </p>
          ) : (
            notes.map((n) => (
              <div
                key={n.note_id}
                className="mt-[20px] shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-2xl py-[20px] px-[20px] text-justify"
              >
                {editingId === n.note_id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => {setEditText(e.target.value); setEmptyEditError("")}}
                      className="w-full p-2 resize-none border rounded-xl"
                    />

                    <div className="mt-2 flex gap-[20px]">
                      <button
                        onClick={handleUpdate}
                        disabled={isEditing}
                        className={`bg-green-600 text-white w-[90px] h-[40px] rounded-xl cursor-pointer
                          ${isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {isEditing ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 text-white w-[90px] h-[40px] rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    {emptyEditError && (<p className="text-[#C10115] pt-[10px]">{emptyEditError}</p>)}
                    {isEditError && (<p className="text-[#C10115] pt-[10px]">{editError.response?.data?.message || "Update failed"}</p>)}
                  </>
                ) : (
                  <>
                    <p>{n.note}</p>
                    <p className="mt-[5px] font-mono">
                      {new Date(n.date).toLocaleDateString()}
                    </p>
                    <div className="mt-[10px] flex gap-[20px]">
                      <button
                        disabled={deletingId === n.note_id}
                        onClick={() => {handleEditClick(n) ,setEmptyEditError("")}}
                        className="bg-yellow-600 text-white w-[90px] h-[40px] rounded-xl cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                      disabled={deletingId === n.note_id}
                      onClick={() => handleDeleteNote(n)}
                      className="bg-red-700 text-white w-[90px] h-[40px] rounded-xl cursor-pointer">
                        {deletingId === n.note_id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    {deleteErrorId === n.note_id && (
                      <p className="text-[#C10115] pt-[15px]">
                        {deleteError?.response?.data?.message || "Delete failed"}
                      </p>
                    )}
                  </>
                )}
              </div>
            )))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
