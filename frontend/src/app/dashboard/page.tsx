"use client";

import { decodeToken } from "@/components/utils/decodeToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react"; // Import the edit and trash icons

import NotesSortButton from "@/components/SortNotes";
import SearchNotes from "@/components/SearchNotes";

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [expiryTime, setExpiryTime] = useState<number>(0);
  const [isUserId, setIsUserId] = useState<string>("");
  const router = useRouter();
  const [storeUsername, setStoreUsername] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [hasMoreNotes, setHasMoreNotes] = useState(true); // Track if more notes are available
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null); // Track which note is being edited
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // State for delete confirmation dialog
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null); // Track which note is being deleted
  const [totalNotesDatabase, setTotalNotesDatabase] = useState<number | null>(
    null
  ); // Track
  const [sortBy, setSortBy] = useState("created_at"); // Default sort by creation date
  const [isSearching, setIsSearching] = useState(false); // State for search loading

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      try {
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
        }
        if (decodedToken && decodedToken.username && decodedToken.userId) {
          setStoreUsername(decodedToken.username);
          const queryParams = new URLSearchParams(window.location.search);
          const u_id = queryParams.get("Id") || "";
          setIsUserId(u_id);
          const urlUsername = queryParams.get("username") || "";
          const urlId = queryParams.get("Id") || "";
          if (
            !queryParams.has("username") ||
            !queryParams.has("Id") ||
            urlUsername !== decodedToken.username ||
            urlId !== decodedToken.userId
          ) {
            router.push(
              `/dashboard?username=${decodedToken.username}&Id=${decodedToken.userId}`
            );
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/login");
      }
    }
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;
      if (expiryTime < currentTime) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router, isUserId]);

  // Fetch notes when isUserId changes
  useEffect(() => {
    if (isUserId) {
      fetchNotes(currentPage); // Fetch initial notes when the component mounts
    }
  }, [isUserId]); // Re-fetch notes if isUserId changes

  const fetchNotes = async (page: any) => {
    if (!isUserId) {
      console.error("User ID is missing");
      return; // Exit the function if isUserId is not set
    }
    setIsLoadingNotes(true);
    const limit = 5; // Set the limit for the number of notes to fetch per request
    try {
      const response = await fetch(
        `http://localhost:4000/api/fetchNote/notes/${isUserId}?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const { notes: newNotes = [], totalNotes = 0 } = await response.json();
      setTotalNotesDatabase(totalNotes);
      if (newNotes.length > 0) {
        setNotes((prevNotes) => {
          const updatedNotes = [...prevNotes, ...newNotes]; // Append new notes to the existing list
          // Check if there are more notes to fetch
          setHasMoreNotes(updatedNotes.length < totalNotes);
          return updatedNotes;
        });
      } else {
        setHasMoreNotes(false); // No more notes to fetch
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes. Please try again.");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/searchNote/search-notes/${isUserId}?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to search notes");
      }
      const data = await response.json();
      setNotes(data); // Update notes with search results
    } catch (error) {
      console.error("Error searching notes:", error);
      alert("Failed to search notes. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = async () => {
    setNotes([]); // Clear the notes state before fetching
    await fetchNotes(currentPage); // Fetch all notes
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Fetch or sort notes based on the newSortBy value
    fetchSortedNotes(newSortBy);
  };

  const fetchSortedNotes = async (sortBy: string) => {
    if (!isUserId) {
      console.error("User ID is missing");
      return; // Exit the function if isUserId is not set
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/sortNote/sort-notes/${isUserId}?sortBy=${sortBy}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes. Please try again111.");
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNotes(nextPage); // Fetch the next batch of notes
  };

  const handleCreateNoteClick = () => {
    setEditingNote(null); // Reset editing note
    setIsModalOpen(true);
  };

  const handleEditNoteClick = (note: Note) => {
    setEditingNote(note); // Set the note being edited
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsModalOpen(true);
  };

  const handleDeleteNoteClick = (noteId: number) => {
    setNoteToDelete(noteId); // Set the note ID to delete
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteNote = async () => {
    if (noteToDelete === null) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/deleteNote/delete-note/${isUserId}/${noteToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      const data = await response.json();
      console.log("Note deleted successfully:", data);

      // Close the delete confirmation dialog
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);

      // Refetch notes after deletion
      fetchNotes(currentPage);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/addNote/add-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: isUserId,
            title: noteTitle,
            content: noteContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit note");
      }

      const data = await response.json();
      console.log("Note submitted successfully:", data);

      // Reset form and close modal
      setIsModalOpen(false);
      setNoteTitle("");
      setNoteContent("");
      setEditingNote(null);
      // Refetch notes after adding a new note
      fetchNotes(currentPage);
    } catch (error) {
      console.error("Error submitting note:", error);
      alert("Failed to submit note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!editingNote) {
        throw new Error("No note is being edited");
      }

      const response = await fetch(
        `http://localhost:4000/api/updateNote/update-note/${isUserId}/${editingNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const data = await response.json();
      console.log("Note updated successfully:", data);

      // Reset form and close modal
      setIsModalOpen(false);
      setNoteTitle("");
      setNoteContent("");
      setEditingNote(null);
      // Refetch notes after updating a note
      fetchNotes(currentPage);
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setNoteTitle("");
    setNoteContent("");
  };

  return (
    <div className="p-6">
      {storeUsername ? (
        <>
          <div className="headerContent flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-0">
              Welcome back,
              <span className="text-blue-600"> {storeUsername}</span>
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateNoteClick}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                Create Note
              </Button>
              <div className="sm:hidden">
                <NotesSortButton onSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            {/* Sort Button - Hidden on small screens (already in header) */}
            <div className="hidden sm:block w-full sm:w-auto">
              <NotesSortButton onSortChange={handleSortChange} />
            </div>

            {/* Search Notes - Visible on all screens */}
            <div className="w-full sm:w-auto">
              <SearchNotes
                userId={isUserId}
                onSearch={handleSearch}
                onReset={handleReset}
                isSearching={isSearching}
              />
            </div>
          </div>

          {/* Display fetched notes in a responsive grid */}
          <div className="flex flex-wrap gap-4">
            {isLoadingNotes && currentPage === 1 ? (
              <p>Loading notes...</p>
            ) : notes.length > 0 ? (
              <>
                {/* {console.log("Number of notes displayed:", notes.length)} */}
                {notes.map((note, index) => (
                  <Card
                    key={`${note.id}-${index}`} // Combine ID and index for uniqueness
                    className="flex-1 min-w-[250px] max-w-[350px] relative"
                  >
                    <CardHeader>
                      <CardTitle>{note.title}</CardTitle>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditNoteClick(note)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNoteClick(note.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{note.content}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Created at: {new Date(note.created_at).toLocaleString()}
                      </p>
                      {note.updated_at !== note.created_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          Updated at:{" "}
                          {new Date(note.updated_at).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <p>No notes found.</p>
            )}
          </div>
          {hasMoreNotes && notes.length !== totalNotesDatabase && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                disabled={isLoadingNotes}
              >
                {isLoadingNotes ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}

      {/* Create/Edit Note Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Edit Note" : "Create Note"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={editingNote ? handleUpdate : handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input
                  id="title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="content" className="text-right">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={noteContent}
                  onChange={(e: any) => setNoteContent(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              {editingNote ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="cursor-pointer"
              >
                Clear
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteNote}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
