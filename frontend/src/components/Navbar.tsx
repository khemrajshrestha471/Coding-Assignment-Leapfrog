"use client";

import { Button } from "@/components/ui/button";
import { Menu, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

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
              NoteSwift
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
          <Link href="/get-started">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
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
          isMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0" // Add border only when menu is open
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
          <Link href="/get-started">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
