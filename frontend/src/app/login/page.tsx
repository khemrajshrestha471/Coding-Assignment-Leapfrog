"use client"; // Required for client-side interactivity

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"; // For navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Define the schema for form validation using Zod
const loginSchema = z
  .object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string()
  });

// Infer the type of the form data from the schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter(); // To navigate to dashboard after successful login

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Make request to check email and validate password
      const response = await fetch('http://localhost:4000/api/login/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // If login is successful, navigate to the dashboard
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        // console.error("Login failed:", errorData.message);
        alert("Login failed. Please check your credentials.");
      }
      reset();
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Log In
            </Button>
          </form>
          <div className="text-left">
            <a
              href="/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
