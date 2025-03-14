"use client"; // Required for client-side interactivity

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"; // For navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { sonner } from "@/components/ui/sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { decodeToken } from "@/components/utils/decodeToken";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the schema for form validation using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string(),
});

// Infer the type of the form data from the schema
type LoginFormData = z.infer<typeof loginSchema>;

// Define the schema for the forgot password form
const forgotPasswordSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(15, { message: "Username must be at most 15 characters." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers.",
    }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Contact number can only contain digits." })
    .length(10, { message: "Contact number must be exactly 10 digits." })
    .refine((val) => val.startsWith("9"), {
      message: "Contact number must start with 9.",
    }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function LoginPage() {
  const router = useRouter(); // To navigate to dashboard after successful login
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<ForgotPasswordFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    reset: resetForgotPassword,
    formState: { errors: forgotPasswordErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register: registerResetPassword,
    handleSubmit: handleSubmitResetPassword,
    reset: resetResetPassword,
    formState: { errors: resetPasswordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: any) => !prevState);
  };
  const togglePasswordNewVisibility = () => {
    setShowNewPassword((prevState: any) => !prevState);
  };
  const togglePasswordConfirmNewVisibility = () => {
    setShowNewConfirmPassword((prevState: any) => !prevState);
  };

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to dashboard if token exists
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        router.push(
          `/dashboard?username=${decodedToken.username}&Id=${decodedToken.userId}`
        );
      }
    }
  }, [router]);

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Make request to check email and validate password
      const response = await fetch("http://localhost:4000/api/login/enter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
        const token = localStorage.getItem("token");
        if (token) {
          // Redirect to dashboard if token exists
          const decodedToken = decodeToken(token);
          router.push(
            `/dashboard?username=${decodedToken.username}&Id=${decodedToken.userId}`
          );
        }
      } else {
        const errorData = await response.json();
        sonner.error(
          <span className="text-red-500">
            Login failed. Please check your credentials.
          </span>,
          {
            description: (
              <span className="text-red-500">{errorData.message}</span>
            ),
          }
        );
      }
      reset();
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">
          Login failed. Please check your credentials.
        </span>
      );
    }
  };

  // Handle forgot password form submission
  const onSubmitForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // Step 1: Verify if the entered data matches the database
      const verifyResponse = await fetch(
        "http://localhost:4000/api/checkUserEmailPhone/check-user-existence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            phone: data.phone,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.exists) {
        // If no matching user is found, show an error message
        setLoading(false);
        sonner.error(
          <span className="text-red-500">
            No matching user found with the provided details.
          </span>
        );
        return;
      }
      setLoading(false);
      setFormData(data);

      // Step 2: If verification is successful, send OTP
      const otpResponse = await fetch(
        "http://localhost:4000/api/handleOtp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (otpResponse.ok) {
        setIsOtpDialogOpen(true);
        setLoading(false);
        setIsForgotPasswordDialogOpen(false);
      } else {
        const errorData = await otpResponse.json();
        sonner.error(
          <span className="text-red-500">Failed to send OTP.</span>,
          {
            description: (
              <span className="text-red-500">{errorData.message}</span>
            ),
          }
        );
      }
      resetForgotPassword();
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">Error during OTP sending.</span>,
        {
          description: <span className="text-red-500">{error}</span>,
        }
      );
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!formData)
      return sonner.error(
        <span className="text-red-500">
          Form data is missing. Please try again.
        </span>
      );
    try {
      const verifyResponse = await fetch(
        "http://localhost:4000/api/handleOtp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );

      if (verifyResponse.ok) {
        setShowResetPasswordDialog(true);
        setIsOtpDialogOpen(false);
      } else {
        setOtp("");
        const errorData = await verifyResponse.json();
        sonner.error(
          <span className="text-red-500">OTP verification failed.</span>,
          {
            description: (
              <span className="text-red-500">{errorData.message}</span>
            ),
          }
        );
      }
    } catch (error: any) {
      setOtp("");
      sonner.error(
        <span className="text-red-500">OTP verification Failed.</span>
      );
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const onSubmitResetPassword = async (data: ResetPasswordFormData) => {
    try {
      const resetResponse = await fetch(
        "http://localhost:4000/api/updatePassword/resetPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData?.username,
            email: formData?.email,
            phone: formData?.phone,
            newPassword: data.newPassword,
          }),
        }
      );

      if (resetResponse.ok) {
        sonner.success(
          <span className="text-green-500">Password reset successfully!</span>
        );
        setShowResetPasswordDialog(false); // Close the dialog
        router.push("/login"); // Redirect to login page
      } else {
        const errorData = await resetResponse.json();
        sonner.error(
          <span className="text-red-500">Password reset failed.</span>,
          {
            description: (
              <span className="text-red-500">{errorData.message}</span>
            ),
          }
        );
      }
    } catch (error: any) {
      sonner.error(
        <span className="text-red-500">Error resetting password.</span>,
        {
          description: <span className="text-red-500">{error.message}</span>,
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden absolute inset-0">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Log In
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Log In
            </Button>
          </form>
          <div className="flex justify-between">
            <div className="text-left">
              <a
                href="/signup"
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Sign up
              </a>
            </div>
            <div className="text-right">
              <a
                className="text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => setIsForgotPasswordDialogOpen(true)}
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Forgot Password Dialog */}
      <Dialog
        open={isForgotPasswordDialogOpen}
        onOpenChange={setIsForgotPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Reset Your Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Please enter your username, email and phone number to receive an
              OTP.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...registerForgotPassword("username")}
              />
              {forgotPasswordErrors.username && (
                <p className="text-sm text-red-500">
                  {forgotPasswordErrors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...registerForgotPassword("email")}
              />
              {forgotPasswordErrors.email && (
                <p className="text-sm text-red-500">
                  {forgotPasswordErrors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Enter your phone number"
                {...registerForgotPassword("phone")}
              />
              {forgotPasswordErrors.phone && (
                <p className="text-sm text-red-500">
                  {forgotPasswordErrors.phone.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForgotPassword()}
                className="cursor-pointer"
              >
                Clear
              </Button>
              {loading ? (
                <>
                  <Button type="button" className="bg-gray-600" disabled>
                    Sending OTP...
                  </Button>
                </>
              ) : (
                <>
                  <Button type="submit" className="cursor-pointer">
                    Send OTP
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              onClick={handleOtpVerification}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Verify OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Enter New Password
            </DialogTitle>
            <DialogDescription className="text-center">
              Please enter and confirm your new password.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitResetPassword(onSubmitResetPassword)} // Use handleSubmitResetPassword
            className="space-y-4"
          >
            {/* New Password Field */}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...registerResetPassword("newPassword")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordNewVisibility}
                  data-testid="toggle-password-new-visibility"
                >
                  {showNewPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {resetPasswordErrors.newPassword && (
                <p className="text-sm text-red-500">
                  {resetPasswordErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showNewConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  {...registerResetPassword("confirmPassword")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordConfirmNewVisibility}
                  data-testid="toggle-password-confirm-new-visibility"
                >
                  {showNewConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {resetPasswordErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {resetPasswordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => resetResetPassword()} // Use resetResetPassword
                className="cursor-pointer"
              >
                Clear
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
}
