"use client"; // Required for client-side interactivity

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { sonner } from "@/components/ui/sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Define the schema for form validation using Zod
const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .max(15, { message: "Username must be at most 15 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Username can only contain letters and numbers.",
      }),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^[0-9]+$/, { message: "Contact number can only contain digits." })
      .length(10, { message: "Contact number must be exactly 10 digits." })
      .refine((val) => val.startsWith("9"), {
        message: "Contact number must start with 9.",
      }),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password did not match",
    path: ["confirmPassword"], // Attach error to confirmPassword field
  });

// Infer the type of the form data from the schema
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const togglePasswordVisibilityConfirm = () => {
    setShowPasswordConfirm((prevState) => !prevState);
  };

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const checkExistenceResponse = await fetch(
        "http://20.197.52.87:4000/api/checkExistence/check-existence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, phone: data.phone }),
        }
      );
      if (!checkExistenceResponse.ok) {
        reset();
        setLoading(false);
        return sonner.error(
          <span className="text-red-500">
            Email or Phone Number already exists.
          </span>
        );
      }
      // Save the email for OTP verification
      setEmail(data.email);
      setFormData(data);

      // Send OTP to the provided email
      const otpResponse = await fetch(
        "http://20.197.52.87:4000/api/handleOtp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (otpResponse.ok) {
        // Open the OTP dialog
        setIsOtpDialogOpen(true);
        setLoading(false);
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
        "http://20.197.52.87:4000/api/handleOtp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (verifyResponse.ok) {
        const registrationResponse = await fetch(
          "http://20.197.52.87:4000/api/signup/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (registrationResponse.ok) {
          sonner.success(
            <span className="text-green-500">
              User registered successfully!
            </span>
          );
          // reset();
          setOtp(""); // Reset OTP input field
          router.push("/login");
        } else {
          const errorData = await registrationResponse.json();
          sonner.error(
            <span className="text-red-500">
              Email or Phone should be unique.
            </span>,
            {
              description: (
                <span className="text-red-500">{errorData.message}</span>
              ),
            }
          );
        }
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

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 inset-0">
      <Card className="w-full max-w-md mt-7 mb-7">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="text-center">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

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

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibilityConfirm}
                >
                  {showPasswordConfirm ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {loading ? (
              <>
                <Button type="button" className="w-full bg-gray-600" disabled>
                  Sending OTP...
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Sign Up
                </Button>
              </>
            )}
          </form>
          <div className="text-left">
            <a href="/login" className="text-sm text-blue-600 hover:underline">
              Have an account? Log in
            </a>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
