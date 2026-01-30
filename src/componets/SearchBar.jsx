import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ query, onChange }) {
  return (
    <div dir="rtl" className="relative">
      <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
      <Input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="חיפוש משימה..."
        className="h-12 rounded-2xl bg-white/80 pr-12"
      />
    </div>
  );
}
