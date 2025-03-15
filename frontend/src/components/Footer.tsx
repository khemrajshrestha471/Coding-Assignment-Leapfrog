import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          <a href="https://www.khemrajshrestha.com.np/">Khem Raj Shrestha </a>
          &copy; {new Date().getFullYear()} NoteX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
