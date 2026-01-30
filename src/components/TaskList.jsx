import TaskItem from "./TaskItem.jsx";
import { Sparkles } from "lucide-react";

export default function TaskList({ tasks, categories, isGridView, onToggle, onToggleImportant, onDelete, onEdit }) {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in">
        <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 p-8 rounded-full mb-6 ring-4 ring-white shadow-xl">
            <Sparkles className="h-12 w-12 text-violet-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">הכל נקי כאן!</h3>
        <p className="text-slate-500 max-w-[280px] leading-relaxed">
           אין משימות כרגע. זה הזמן להוסיף משימה חדשה ולהתחיל ליצור.
        </p>
      </div>
    );
  }

  return (
    <div className={`
      ${isGridView 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "flex flex-col gap-3"
      } pb-4
    `}>
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          categories={categories}
          isGridView={isGridView}
          onToggle={() => onToggle(t.id)}
          onToggleImportant={() => onToggleImportant(t.id)}
          onDelete={() => onDelete(t.id)}
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
}