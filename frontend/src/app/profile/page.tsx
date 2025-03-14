"use client";

import { decodeToken } from "@/components/utils/decodeToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sonner } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input"; // Import Input component from shadcn
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [expiryTime, setExpiryTime] = useState<number>(0);
  const [isUserId, setIsUserId] = useState<string>("");
  const router = useRouter();
  const [storeUsername, setStoreUsername] = useState<string>("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    created_at: "",
  });
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              `/profile?username=${decodedToken.username}&Id=${decodedToken.userId}`
            );
          }
        }
      } catch (error: any) {
        sonner.error(
          <span className="text-red-500">Error decoding token.</span>,
          {
            description: <span className="text-red-500">{error}</span>,
          }
        );
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

  useEffect(() => {
    // Fetch user details from the backend
    if (!isUserId) {
      return; // Return early if isUserId is not provided
    }
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/fetchUserProfile/fetch-users/${isUserId}`
        );
        if (!response.ok) {
          sonner.error(
            <span className="text-red-500">Failed to fetch user details.</span>
          );
        }
        const data = await response.json();
        setUser(data.user); // Set the fetched user data
        setUpdatedUsername(data.user.username); // Initialize updatedUsername with fetched username
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isUserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle username update
  const handleUpdateUsername = async () => {
    try {
      // Check if the updated username is different from the stored username
      if (updatedUsername === user.username) {
        sonner.error(
          <span className="text-red-500">
            No changes detected. Fields remains the same.
          </span>
        );
        return;
      }

      // Send a PUT request to update the username
      const response = await fetch(
        `http://localhost:4000/api/updateUsername/update-username/${isUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: updatedUsername }),
        }
      );

      if (!response.ok) {
        sonner.error(
          <span className="text-red-500">Failed to update username.</span>
        );
      }

      // Update the user state with the new username
      setUser((prevUser) => ({
        ...prevUser,
        username: updatedUsername,
      }));
      window.location.reload();
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">Failed to update username.</span>,
        {
          description: <span className="text-red-500">{error}</span>,
        }
      );
    }
  };

  // Handle reset username
  const handleResetUsername = () => {
    setUpdatedUsername(user.username); // Reset to the original username
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
        <div className="space-y-4">
          {/* Username Field */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ""}
              readOnly
              className="mt-1"
            />
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={user.phone || ""}
              readOnly
              className="mt-1"
            />
          </div>

          {/* Created At Field */}
          <div>
            <Label htmlFor="created_at">Created At</Label>
            <Input
              id="created_at"
              value={
                user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : ""
              }
              readOnly
              className="mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Button onClick={handleUpdateUsername} className="cursor-pointer">
              Update
            </Button>
            <Button
              variant="outline"
              onClick={handleResetUsername}
              className="cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
