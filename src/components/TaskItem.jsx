import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, Trash2, Check, X, Calendar, Star, ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskItem({ task, categories, isGridView, onToggle, onToggleImportant, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftCategory, setDraftCategory] = useState(task.category);
  const [draftDate, setDraftDate] = useState(task.dueDate || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryMeta = useMemo(() => {
    const idToCheck = editing ? draftCategory : task.category;
    return categories.find((c) => c.id === idToCheck) || categories.find((c) => c.id === "general");
  }, [categories, task.category, draftCategory, editing]);

  const cardBackground = task.completed 
    ? "bg-slate-50 opacity-60 grayscale" 
    : (categoryMeta?.cardBg || "bg-white");
    
  const badgeStyle = task.completed
    ? "bg-slate-200 text-slate-500"
    : `bg-white/90 shadow-sm ${categoryMeta?.text || "text-slate-700"}`;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(), 300);
  };

  function save() {
    const clean = draftTitle.trim();
    if (!clean) return;
    onEdit(task.id, clean, draftCategory, draftDate);
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
    setDraftTitle(task.title);
    setDraftCategory(task.category);
    setDraftDate(task.dueDate || "");
  }

  const formatDateDisplay = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' }).format(date);
  };

  const CategorySelector = () => (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button className={`
          flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border-0 shadow-sm transition-all hover:opacity-80 outline-none ring-offset-2 focus:ring-2 ring-violet-200 bg-white
        `}>
          <span className={categoryMeta?.text}>{categoryMeta?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40 rounded-xl p-1.5 shadow-xl border-slate-100 bg-white">
        {categories.map((cat) => (
          <DropdownMenuItem
            key={cat.id}
            onClick={() => setDraftCategory(cat.id)}
            className="flex items-center gap-2 rounded-lg py-2 cursor-pointer focus:bg-slate-50"
          >
            <div className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
            <span className="flex-1 font-medium text-slate-700">{cat.label}</span>
            {draftCategory === cat.id && <Check className="h-3.5 w-3.5 text-violet-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isGridView) {
    return (
      <div 
        className={`
          group relative flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 animate-in
          border border-transparent
          ${isDeleting ? 'scale-90 opacity-0' : ''}
          ${cardBackground}
          ${!task.completed && "shadow-sm hover:shadow-xl hover:-translate-y-1"}
        `}
      >
        <div className="flex justify-between items-start mb-3">
          {editing ? (
            <CategorySelector />
          ) : (
            <Badge className={`rounded-xl px-3 py-1.5 text-xs font-bold border-0 ${badgeStyle}`}>
              {categoryMeta.label}
            </Badge>
          )}
          
          <button 
            onClick={onToggleImportant}
            className={`transition-all hover:scale-110 ${task.isImportant ? "text-amber-400 fill-amber-400" : "text-slate-400/50 hover:text-amber-400"}`}
          >
            <Star className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
           {!editing ? (
             <p 
               className={`text-lg font-semibold leading-snug cursor-pointer ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}
               onDoubleClick={() => setEditing(true)}
             >
               {task.title}
             </p>
           ) : (
             <div className="space-y-2">
               <Input
                 value={draftTitle}
                 onChange={(e) => setDraftTitle(e.target.value)}
                 className="h-auto py-1 px-0 border-0 border-b-2 border-violet-500 rounded-none bg-transparent text-lg focus-visible:ring-0"
                 autoFocus
                 onKeyDown={(e) => {
                   if (e.key === "Enter") save();
                   if (e.key === "Escape") cancel();
                 }}
               />
               <div className="relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-violet-500">
                    <Calendar className="h-4 w-4" />
                 </div>
                 <input 
                    type="date" 
                    value={draftDate} 
                    onChange={(e) => setDraftDate(e.target.value)}
                    onClick={(e) => e.target.showPicker()}
                    className="text-sm bg-transparent border-b border-slate-200 focus:border-violet-500 outline-none text-slate-600 w-full pr-6 cursor-pointer"
                 />
               </div>
             </div>
           )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/5">
           <div className={`flex items-center gap-2 text-xs font-medium ${task.dueDate ? "text-slate-600 bg-white/50 px-2 py-1 rounded-lg" : "text-slate-400"}`}>
             <Calendar className="h-3.5 w-3.5" />
             {task.dueDate ? formatDateDisplay(task.dueDate) : "אין תאריך"}
           </div>
           
           <div className="flex gap-1 relative">
             {!editing ? (
                <>
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={onToggle} 
                    className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 cursor-pointer bg-white/50 border-slate-300" 
                  />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 left-8 bg-white shadow-lg rounded-full px-1 py-1 ring-1 ring-slate-100">
                     <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                     <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-slate-400 hover:text-violet-500 hover:bg-violet-50" onClick={() => setEditing(true)}>
                        <Pencil className="h-4 w-4" />
                     </Button>
                  </div>
                </>
             ) : (
                <div className="flex gap-1">
                   <Button size="icon" className="h-8 w-8 rounded-full bg-violet-600 hover:bg-violet-700" onClick={save}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-slate-100" onClick={cancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        group relative flex items-center justify-between gap-4 rounded-2xl p-4 transition-all duration-300 animate-in
        border border-transparent
        ${isDeleting ? 'translate-x-full opacity-0' : ''}
        ${cardBackground}
        ${!task.completed && "shadow-sm hover:shadow-md hover:scale-[1.01]"}
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={onToggle} 
          disabled={editing}
          className="h-6 w-6 rounded-lg border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-fuchsia-500 data-[state=checked]:border-transparent transition-all cursor-pointer bg-white/50 border-slate-300" 
        />

        {!editing ? (
          <div className="flex flex-col gap-1.5 w-full cursor-pointer" onDoubleClick={() => setEditing(true)}>
            <div className="flex items-center gap-2">
              <span className={`text-base font-medium transition-all ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                {task.title}
              </span>
              {task.isImportant && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`rounded-lg px-2.5 py-0.5 text-xs font-bold border-0 ${badgeStyle}`}>
                {categoryMeta.label}
              </Badge>
              
              {task.dueDate && (
                <span className="text-xs text-slate-600 bg-white/50 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                   <Calendar className="w-3 h-3" /> {formatDateDisplay(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-3 flex-wrap">
             <Input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="h-10 rounded-xl bg-white/50 border-transparent focus:bg-white focus:border-violet-200 shadow-inner min-w-[200px] flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
            />
            <CategorySelector />
            
            <div className="relative w-36 group">
               <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-violet-500">
                  <Calendar className="h-4 w-4" />
               </div>
               <input 
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  onClick={(e) => e.target.showPicker()}
                  className="h-9 rounded-xl border border-slate-200 pl-8 pr-2 text-xs text-slate-600 focus:border-violet-500 outline-none w-full bg-white cursor-pointer"
               />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {!editing && (
          <button 
            onClick={onToggleImportant}
            className={`p-2 rounded-full transition-all ${task.isImportant ? "text-amber-400 fill-amber-400 bg-amber-50" : "text-slate-400/50 hover:text-amber-400 hover:bg-amber-50"}`}
          >
            <Star className="h-5 w-5" />
          </button>
        )}
        
        {!editing ? (
          <>
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-400 hover:text-violet-600 hover:bg-white/50" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-white/50" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex gap-1">
             <Button size="icon" className="h-9 w-9 rounded-full bg-violet-600 hover:bg-violet-700" onClick={save}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full hover:bg-white/50" onClick={cancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}