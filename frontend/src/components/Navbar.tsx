"use client";

import { Button } from "@/components/ui/button";
import { Menu, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { decodeToken } from "@/components/utils/decodeToken";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sonner } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [expiryTime, setExpiryTime] = useState(0);
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [storeUsername, setStoreUsername] = useState("");
  const [isUserId, setIsUserId] = useState("");
  const [username, setUsername] = useState(""); // State to store the fetched username
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = decodeToken(token);
        setStoreUsername(decodedToken.username);
        setIsUserId(decodedToken.userId);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
          setShowGetStarted(false);
        }
      } catch (error: any) {
        sonner.error(
          <span className="text-red-500">Error decoding token.</span>,
          {
            description: <span className="text-red-500">{error}</span>,
          }
        );
      }
    }
    // Token expiry check
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;
      if (expiryTime < currentTime) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Adding scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasRefreshed");
    setShowGetStarted(true);
    router.push("/login");
  };

  useEffect(() => {
    // Fetch user details from the backend
    const fetchUserProfile = async () => {
      try {
        if (!isUserId) {
          return;
        }
        const response = await fetch(
          `https://leapfrog-note-taking-app-backend-ecaaaccdeteqgues.eastasia-01.azurewebsites.net/api/fetchUserProfile/fetch-users/${isUserId}`
        );
        if (!response.ok) {
          sonner.error(
            <span className="text-red-500">Failed to fetch user profile.</span>
          );
        }
        const data = await response.json();
        setUsername(data.user.username); // Set the fetched username
      } catch (error: any) {
        sonner.error(
          <span className="text-red-500">Something went wrong.</span>,
          {
            description: <span className="text-red-500">{error.message}</span>,
          }
        );
      }
    };

    fetchUserProfile();
  }, [isUserId]);

  return (
    <nav
      className={`w-full bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isSticky ? "py-3" : "py-4" // Reduce padding when sticky
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <NotebookPen
              className={`text-blue-600 transition-all duration-300 ${
                isSticky ? "h-5 w-5" : "h-6 w-6" // Reduce icon size when sticky
              }`}
            />
            <span
              className={`font-semibold text-gray-800 transition-all duration-300 ${
                isSticky ? "text-lg" : "text-xl" // Reduce text size when sticky
              }`}
            >
              NoteX
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/features">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Features
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Pricing
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Contact
            </Button>
          </Link>
          {showGetStarted ? (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Get Started
              </Button>
            </Link>
          ) : (
            <>
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {username ? username.slice(0, 2).toUpperCase() : "XX"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard?username=${username}&Id=${isUserId}`}
                      className="flex items-center w-full"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile?username=${username}&Id=${isUserId}`}
                      className="flex items-center w-full"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={LogOut}
              >
                Log Out
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Links with Transition */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-2 px-6 py-4">
          <Link href="/features">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-blue-600"
            >
              Features
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-blue-600"
            >
              Pricing
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-blue-600"
            >
              Contact
            </Button>
          </Link>
          {showGetStarted ? (
            <Link href="/login">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Get Started
              </Button>
            </Link>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard?username=${username}&Id=${isUserId}`}
                      className="flex items-center w-full"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/profile?username=${username}&Id=${isUserId}`}
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="w-full justify-start bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={LogOut}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
