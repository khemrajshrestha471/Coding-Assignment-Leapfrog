import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Import shadcn Input component
import { Button } from "@/components/ui/button"; // Import shadcn Button component
import { Loader2 } from "lucide-react"; // Import loading spinner from lucide-react
import { sonner } from '@/components/ui/sonner';

interface SearchNotesProps {
  userId: string; // User ID for fetching notes
  onSearch: (query: string, isFromSearch: boolean) => void; // Callback to handle search results
  onReset: () => void; // Callback to reset search
  isSearching: boolean; // Loading state for search
}

const SearchNotes: React.FC<SearchNotesProps> = ({
  userId,
  onSearch,
  onReset,
  isSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Handle search button click
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return sonner.error(<span className="text-red-500">Please enter a search term.</span>);;
    }
    onSearch(searchQuery, true); // Trigger search in parent component
  };

  // Handle reset button click
  const handleReset = () => {
    setSearchQuery(""); // Clear search query
    onReset(); // Trigger reset in parent component
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search Here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />

      {/* Search Button */}
      <Button onClick={handleSearch} disabled={isSearching} className="cursor-pointer">
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
          </>
        ) : (
          "Search"
        )}
      </Button>

      {/* Reset Button */}
      <Button variant="outline" onClick={handleReset} disabled={isSearching} className="cursor-pointer">
        Reset
      </Button>
    </div>
  );
};

export default SearchNotes;
