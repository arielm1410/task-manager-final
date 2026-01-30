import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Check, ChevronLeft, Calendar } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VIBRANT_COLORS = [
  { id: "red", bg: "bg-red-500", cardBg: "bg-red-50", text: "text-red-700" },
  { id: "orange", bg: "bg-orange-500", cardBg: "bg-orange-50", text: "text-orange-700" },
  { id: "amber", bg: "bg-amber-500", cardBg: "bg-amber-50", text: "text-amber-700" },
  { id: "emerald", bg: "bg-emerald-500", cardBg: "bg-emerald-50", text: "text-emerald-700" },
  { id: "teal", bg: "bg-teal-500", cardBg: "bg-teal-50", text: "text-teal-700" },
  { id: "cyan", bg: "bg-cyan-500", cardBg: "bg-cyan-50", text: "text-cyan-700" },
  { id: "blue", bg: "bg-blue-500", cardBg: "bg-blue-50", text: "text-blue-700" },
  { id: "indigo", bg: "bg-indigo-500", cardBg: "bg-indigo-50", text: "text-indigo-700" },
  { id: "violet", bg: "bg-violet-500", cardBg: "bg-violet-50", text: "text-violet-700" },
  { id: "fuchsia", bg: "bg-fuchsia-500", cardBg: "bg-fuchsia-50", text: "text-fuchsia-700" },
  { id: "pink", bg: "bg-pink-500", cardBg: "bg-pink-50", text: "text-pink-700" },
  { id: "rose", bg: "bg-rose-500", cardBg: "bg-rose-50", text: "text-rose-700" },
];

export default function TaskForm({ onAdd, onAddCategory, categories }) {
  const [open, setOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.id || "general");
  const [dueDate, setDueDate] = useState("");
  
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState(VIBRANT_COLORS[6]);

  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.id === category)) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  function resetForm() {
    setTitle("");
    setCategory(categories[0]?.id || "general");
    setDueDate("");
    setIsCreatingCategory(false);
    setNewCatName("");
    setNewCatColor(VIBRANT_COLORS[6]);
  }

  function submitTask(e) {
    e.preventDefault(); 
    const clean = title.trim();
    if (!clean) return;
    onAdd(clean, category, dueDate);
    setOpen(false);
    resetForm();
  }

  function submitCategory(e) {
    e.preventDefault();
    const cleanName = newCatName.trim();
    if (!cleanName) return;

    const newId = `cat_${Date.now()}`;
    const newCategory = {
      id: newId,
      label: cleanName,
      color: newCatColor.bg,
      cardBg: newCatColor.cardBg,
      text: newCatColor.text,
      light: `${newCatColor.cardBg} ${newCatColor.text}`
    };

    onAddCategory(newCategory);
    setCategory(newId); 
    setIsCreatingCategory(false); 
    setNewCatName("");
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button 
          className="h-10 w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-white shadow-lg shadow-violet-200 transition-all hover:scale-105 hover:shadow-violet-300 hover:from-violet-700 hover:to-fuchsia-700 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span className="ms-2 font-bold tracking-wide">משימה חדשה</span>
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="sm:max-w-[460px] rounded-[2rem] p-8 border-0 shadow-2xl bg-white/95 backdrop-blur-xl transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-right pb-2">
          <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-600">
            {isCreatingCategory ? "קטגוריה חדשה" : "יצירת משימה"}
          </DialogTitle>
        </DialogHeader>

        {isCreatingCategory ? (
          <form onSubmit={submitCategory} className="space-y-6 pt-2 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">שם הקטגוריה</label>
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="לדוגמה: כושר, קניות, פרוייקט..."
                className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-5 text-lg focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">בחר צבע</label>
              <div className="grid grid-cols-6 gap-3">
                {VIBRANT_COLORS.map((c) => {
                  const isSelected = newCatColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewCatColor(c)}
                      className={`
                        h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200
                        ${c.bg} ${isSelected ? "ring-4 ring-offset-2 ring-slate-200 scale-110" : "hover:scale-110 opacity-80 hover:opacity-100"}
                      `}
                    >
                      {isSelected && <Check className="h-5 w-5 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                className="h-12 rounded-xl text-slate-500 hover:bg-slate-100 gap-2"
                onClick={() => setIsCreatingCategory(false)}
              >
                <ChevronLeft className="h-4 w-4" />
                חזור
              </Button>

              <Button 
                type="submit" 
                disabled={!newCatName.trim()}
                className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                צור קטגוריה
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitTask} className="space-y-6 pt-2 animate-in slide-in-from-left-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">מה צריך לעשות?</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="לדוגמה: לסיים את המצגת..."
                className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-5 text-lg transition-all focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">תאריך יעד</label>
              <div className="relative group">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-5 pl-12 text-lg focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer w-full text-slate-600"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-500 transition-transform group-hover:scale-110">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">תיוג</label>
                <button 
                  type="button" 
                  onClick={() => setIsCreatingCategory(true)}
                  className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 bg-violet-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  קטגוריה חדשה
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((c) => {
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`
                        relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 border-2 text-right
                        ${active
                          ? "border-violet-600 bg-violet-50 text-violet-800"
                          : "border-transparent bg-white shadow-sm hover:bg-slate-50 text-slate-600"
                        }
                      `}
                    >
                      <div className={`h-3 w-3 rounded-full ${c.color} shadow-sm shrink-0`} />
                      <span className="text-sm font-medium flex-1 truncate">{c.label}</span>
                      {active && <Check className="h-4 w-4 text-violet-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-xl text-slate-500 hover:bg-slate-100"
                  onClick={resetForm}
                >
                  ביטול
                </Button>
              </DialogClose>

              <Button 
                type="submit" 
                className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                שמור
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}