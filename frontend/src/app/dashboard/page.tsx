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
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
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
  const [notes, setNotes] = useState<Note[]>([]); // State to store fetched notes
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
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
      fetchNotes();
    }
  }, [isUserId]);

  const fetchNotes = async () => {
    setIsLoadingNotes(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/fetchNote/notes/${isUserId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data); // Store fetched notes in state
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes. Please try again.");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleCreateNoteClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading
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
      // Refetch notes after adding a new note
      fetchNotes();
    } catch (error) {
      console.error("Error submitting note:", error);
      alert("Failed to submit note. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };
  // };

  const handleClear = () => {
    setNoteTitle("");
    setNoteContent("");
  };

  return (
    <div className="p-6">
      {storeUsername ? (
        <>
        <div className="headerContent flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome back, <span className="text-blue-600">{storeUsername}</span>
          </h1>
          <Button
            onClick={handleCreateNoteClick}
            className="cursor-pointer mb-6"
          >
            Create Note
          </Button>
          </div>

          {/* Display fetched notes in a responsive grid */}
          <div className="flex flex-wrap gap-4">
            {isLoadingNotes ? (
              <p>Loading notes...</p>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <Card
                  key={note.id}
                  className="flex-1 min-w-[250px] max-w-[350px]"
                >
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{note.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No notes found.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
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
    </div>
  );
};

export default Page;
