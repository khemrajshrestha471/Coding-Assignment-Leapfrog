"use client";

import { decodeToken } from "@/components/utils/decodeToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sonner } from '@/components/ui/sonner';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
} from "@/components/ui/pagination";

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
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null); // Track which note is being edited
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // State for delete confirmation dialog
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null); // Track which note is being deleted
  const [totalNotesDatabase, setTotalNotesDatabase] = useState<number | null>(
    null
  ); // Track
  const [showPaginationOnSearch, setShowPaginationOnSearch] = useState(true);
  const [sortBy, setSortBy] = useState("created_at"); // Default sort by creation date
  const [isSearching, setIsSearching] = useState(false); // State for search loading
  const [username, setUsername] = useState(""); // State to store the fetched username

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
      } catch (error:any) {
        sonner.error(<span className="text-red-500">Error decoding token.</span>, {
          description: <span className="text-red-500">{error}</span>,
      });
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
  }, [isUserId, currentPage]); // Re-fetch notes if isUserId changes

  const fetchNotes = async (page: any) => {
    if (!isUserId) {
      sonner.error(<span className="text-red-500">User ID is missing.</span>);
      return; // Exit the function if isUserId is not set
    }
    setIsLoadingNotes(true);
    const limit = 2; // Set the limit for the number of notes to fetch per request
    try {
      const response = await fetch(
        `http://localhost:4000/api/fetchNote/notes/${isUserId}?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        sonner.error(<span className="text-red-500">Failed to fetching notes.</span>);
      }
      const { notes: newNotes = [], totalNotes = 0 } = await response.json();
      setTotalNotesDatabase(totalNotes);
      if (newNotes.length > 0) {
        setNotes((prevNotes) => {
          const updatedNotes = [...prevNotes, ...newNotes]; // Append new notes to the existing list
          // Check if there are more notes to fetch
          return updatedNotes;
        });
        setTotalPages(Math.ceil(totalNotes / limit));
      }
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error fetching notes.</span>, {
              description: <span className="text-red-500">{error}</span>,
          });
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update current page
  };

  // Handle search
  const handleSearch = async (query: string, isFromSearch: boolean) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/searchNote/search-notes/${isUserId}?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        sonner.error(<span className="text-red-500">Failed to fetching notes.</span>);
      }
      const data = await response.json();
      setNotes(data); // Update notes with search results
      setTimeout(() => {
        setIsSearching(false);
        if(isFromSearch){
            setShowPaginationOnSearch(false);
        } else{
            setShowPaginationOnSearch(true);
        }
        //handle your search result here.
    }, 1000);
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error searching notes.</span>, {
        description: <span className="text-red-500">{error}</span>,
    });
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = async () => {
    setNotes([]); // Clear the notes state before fetching
    handlePageChange(1)
    await fetchNotes(currentPage); // Fetch all notes
    setShowPaginationOnSearch(true);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Fetch or sort notes based on the newSortBy value
    fetchSortedNotes(newSortBy);
  };

  const fetchSortedNotes = async (sortBy: string) => {
    if (!isUserId) {
      sonner.error(<span className="text-red-500">User ID is missing.</span>);
      return; // Exit the function if isUserId is not set
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/sortNote/sort-notes/${isUserId}?sortBy=${sortBy}`
      );
      if (!response.ok) {
        sonner.error(<span className="text-red-500">Failed to fetching notes.</span>);
      }
      const data = await response.json();
      setNotes(data);
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error fetching notes.</span>, {
        description: <span className="text-red-500">{error}</span>,
    });
    }
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
        sonner.error(<span className="text-red-500">Failed to delete note.</span>);
      }
      window.location.reload();

      // Close the delete confirmation dialog
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);

      // Refetch notes after deletion
      fetchNotes(currentPage);
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error deleting note.</span>, {
        description: <span className="text-red-500">{error}</span>,
    });
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
        sonner.error(<span className="text-red-500">Failed to submit note.</span>);
      }
      window.location.reload();

      // Reset form and close modal
      setIsModalOpen(false);
      setNoteTitle("");
      setNoteContent("");
      setEditingNote(null);
      // Refetch notes after adding a new note
      fetchNotes(currentPage);
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error submitting note.</span>, {
        description: <span className="text-red-500">{error}</span>,
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!editingNote) {
        return sonner.error(<span className="text-red-500">No note is being edited.</span>);
      }

      const response = await fetch(
        `http://localhost:4000/api/updateNote/update-note/${isUserId}/${editingNote?.id}`,
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
        sonner.error(<span className="text-red-500">Failed to update note.</span>);
      }

      window.location.reload();

      // Reset form and close modal
      setIsModalOpen(false);
      setNoteTitle("");
      setNoteContent("");
      setEditingNote(null);
      // Refetch notes after updating a note
      fetchNotes(currentPage);
    } catch (error:any) {
      sonner.error(<span className="text-red-500">Error updating note.</span>, {
        description: <span className="text-red-500">{error}</span>,
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setNoteTitle("");
    setNoteContent("");
  };

  useEffect(() => {
    // Fetch user details from the backend
    const fetchUserProfile = async () => {
      try {
        if (!isUserId) {
          return;
        }
        const response = await fetch(
          `http://localhost:4000/api/fetchUserProfile/fetch-users/${isUserId}`
        );
        if (!response.ok) {
          sonner.error(<span className="text-red-500">Failed to fetch user profile.</span>);
        }
        const data = await response.json();
        setUsername(data.user.username); // Set the fetched username
      } catch (error:any) {
        sonner.error(<span className="text-red-500">Something went wrong.</span>, {
          description: <span className="text-red-500">{error.message}</span>,
      });
      }
    };

    fetchUserProfile();
  }, [isUserId]);

  return (
    <div className="p-6">
      {storeUsername ? (
        <>
          <div className="headerContent flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-0">
              Welcome back,
              <span className="text-blue-600"> {username}</span>
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
                          Updated at:
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
          {notes.length !== totalNotesDatabase && showPaginationOnSearch && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>

                {/* Current Page Display */}
                <PaginationItem>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`cursor-pointer ${
                      currentPage === totalPages || isLoadingNotes
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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