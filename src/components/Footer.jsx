import { Trash2 } from "lucide-react";

export default function Footer({ activeCount, completedCount, onClearCompleted }) {
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-sm">
      
      <span className="text-slate-500 font-medium text-center sm:text-right">
         נותרו <span className="text-indigo-600 font-bold">{activeCount}</span> משימות לביצוע
      </span>

      <button
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className={`
          group flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 transition-all duration-300
          border
          ${completedCount > 0
            ? "bg-red-50 border-red-100 text-red-600 shadow-sm hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            : "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed opacity-0" 
          }
        `}
      >
        <Trash2 
          className={`h-4 w-4 transition-transform duration-300 ${completedCount > 0 ? "group-hover:scale-110 group-hover:rotate-12" : ""}`} 
        />
        <span className="font-semibold tracking-wide">
          נקה {completedCount > 0 ? `${completedCount} ` : ""}שהושלמו
        </span>
      </button>
    </div>
  );
}