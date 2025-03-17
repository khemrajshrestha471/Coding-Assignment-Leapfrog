"use client";

import { decodeToken } from "@/components/utils/decodeToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sonner } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input"; // Import Input component from shadcn
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password and Confirm Password did not match",
    path: ["confirmPassword"],
  });

const Page = () => {
  const [expiryTime, setExpiryTime] = useState<number>(0);
  const [isUserId, setIsUserId] = useState<string>("");
  const router = useRouter();
  const [storeUsername, setStoreUsername] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    created_at: "",
  });
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOldPasswordDialog, setShowOldPasswordDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false); // State for new password dialog
  const [oldPassword, setOldPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    // setError,
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

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
          `http://20.197.52.87:4000/api/fetchUserProfile/fetch-users/${isUserId}`
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
        `http://20.197.52.87:4000/api/updateUsername/update-username/${isUserId}`,
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

  const handleChangePassword = () => {
    setShowOldPasswordDialog(true);
  };

  const handleVerifyOldPassword = async () => {
    try {
      // Send a request to verify the old password
      const response = await fetch(
        `http://20.197.52.87:4000/api/changePassword/change-password/${isUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword: oldPassword }), // Send oldPassword for verification
        }
      );

      // If old password is verified, proceed to the new password dialog
      if (response.ok) {
        setShowOldPasswordDialog(false);
        setShowNewPasswordDialog(true);
      } else {
        sonner.error(
          <span className="text-red-500">Incorrect old password. Please check your credentials.</span>
        );
      }
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">Failed to verify old password.</span>,
        {
          description: <span className="text-red-500">{error.message}</span>,
        }
      );
    }
  };

  // Handle new password submission
  const handleUpdatePassword = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      // Send a PUT request to update the password
      const response = await fetch(
        `http://20.197.52.87:4000/api/changePassword/change-password/${isUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword: data.newPassword }), // Send both old and new passwords
        }
      );

      if (!response.ok) {
        sonner.error(
          <span className="text-red-500">Failed to update password.</span>
        );
      }

      sonner.success(
        <span className="text-green-500">Password updated successfully.</span>
      );

      // Close the new password dialog
      setShowNewPasswordDialog(false);
      reset();
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">Failed to update password.</span>,
        {
          description: <span className="text-red-500">{error.message}</span>,
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: any) => !prevState);
  };
  const togglePasswordNewVisibility = () => {
    setShowNewPassword((prevState: any) => !prevState);
  };
  const togglePasswordConfirmNewVisibility = () => {
    setShowNewConfirmPassword((prevState: any) => !prevState);
  };

  return (
    <div className="flex justify-center mt-10">
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
      <div className="absolute top-17 right-1 m-4">
        <Button className="cursor-pointer" onClick={handleChangePassword}>
          Change Password
        </Button>
      </div>

      <Dialog
        open={showOldPasswordDialog}
        onOpenChange={setShowOldPasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Enter Your Old Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Please enter your old password for conformation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Old Password Field */}
            {/* <div>
              <Label htmlFor="oldPassword" className="mb-2">Old Password</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div> */}
                        <div className="space-y-2">
              <Label htmlFor="oldPassword" className="mb-2">Old Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your old password"
                  value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOldPassword("")}
                className="cursor-pointer"
              >
                Clear
              </Button>
              <Button
                type="button"
                onClick={handleVerifyOldPassword}
                className="cursor-pointer"
              >
                Verify
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/* New Password Dialog */}
      <Dialog
        open={showNewPasswordDialog}
        onOpenChange={setShowNewPasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Enter Your New Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Please enter and confirm your new password.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleUpdatePassword)}
            className="space-y-4"
          >
            {/* New Password Field */}
            {/* <div>
              <Label htmlFor="newPassword" className="mb-2">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div> */}
                        <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("newPassword")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordNewVisibility}
                  data-testid="toggle-password-new-visibility"
                >
                  {showNewPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            {/* <div>
              <Label htmlFor="confirmPassword" className="mb-2">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div> */}

<div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showNewConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  {...register("confirmPassword")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordConfirmNewVisibility}
                  data-testid="toggle-password-confirm-new-visibility"
                >
                  {showNewConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setShowNewPasswordDialog(false);
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
