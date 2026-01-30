import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, SlidersHorizontal } from "lucide-react";

const LABELS = {
  all: "הכל",
  active: "לביצוע",
  completed: "הושלמו",
};

export default function FilterBar({ value, onChange }) {
  const currentLabel = LABELS[value] ?? LABELS.all;

  return (
    <div className="flex items-center">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-slate-600 shadow-sm transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">{currentLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-0 ring-1 ring-slate-100">
          <DropdownMenuItem
            onClick={() => onChange("all")}
            className="flex cursor-pointer items-center justify-between rounded-xl py-2.5 focus:bg-violet-50 focus:text-violet-700"
          >
            <span>הצג הכל</span>
            {value === "all" && <Check className="h-4 w-4 text-violet-600" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChange("active")}
            className="flex cursor-pointer items-center justify-between rounded-xl py-2.5 focus:bg-violet-50 focus:text-violet-700"
          >
            <span>משימות לביצוע</span>
            {value === "active" && <Check className="h-4 w-4 text-violet-600" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChange("completed")}
            className="flex cursor-pointer items-center justify-between rounded-xl py-2.5 focus:bg-violet-50 focus:text-violet-700"
          >
            <span>משימות שהושלמו</span>
            {value === "completed" && <Check className="h-4 w-4 text-violet-600" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}