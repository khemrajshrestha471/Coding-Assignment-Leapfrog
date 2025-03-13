import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, Calendar, Clock } from "lucide-react";

const NotesSortButton = ({ onSortChange }: { onSortChange: (sortBy: string) => void }) => {
  const [sortBy, setSortBy] = useState<string>("created_at"); // Default sort by creation date

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    onSortChange(newSortBy); // Notify parent component about the sort change
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Sort Notes
          <ArrowDownAZ className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => handleSortChange("created_at")}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Creation Date</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("updated_at")}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Last Modified Date</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("title")}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          <span>Title Alphabetical Order</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotesSortButton;