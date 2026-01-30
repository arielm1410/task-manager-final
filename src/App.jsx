import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Footer from "./components/Footer.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, LayoutGrid, List, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_TASKS = "tasks_v4";
const STORAGE_KEY_CATS = "categories_v2";

const DEFAULT_CATEGORIES = [
  { id: "work", label: "עבודה", color: "bg-blue-500", cardBg: "bg-blue-50", text: "text-blue-700", light: "bg-blue-50 text-blue-700" },
  { id: "study", label: "לימודים", color: "bg-purple-500", cardBg: "bg-purple-50", text: "text-purple-700", light: "bg-purple-50 text-purple-700" },
  { id: "personal", label: "אישי", color: "bg-pink-500", cardBg: "bg-pink-50", text: "text-pink-700", light: "bg-pink-50 text-pink-700" },
  { id: "general", label: "כללי", color: "bg-slate-500", cardBg: "bg-slate-50", text: "text-slate-700", light: "bg-slate-50 text-slate-700" },
];

function Notification({ message, type, show }) {
  if (!show) return null;
  const isSuccess = type === "success";
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${
        isSuccess 
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent" 
          : "bg-white text-slate-900 border-slate-200"
      }`}>
        {isSuccess && <PartyPopper className="h-5 w-5 text-yellow-300" />}
        <span className="font-bold text-sm">{message}</span>
      </div>
    </div>
  );
}

function normalizeTasks(list) {
  if (!Array.isArray(list)) return [];
  return list.map((t) => ({
    id: t?.id ?? crypto.randomUUID(),
    title: String(t?.title ?? "").trim(),
    completed: Boolean(t?.completed),
    isImportant: Boolean(t?.isImportant),
    createdAt: Number(t?.createdAt ?? Date.now()),
    dueDate: t?.dueDate ? String(t.dueDate) : "",
    category: typeof t?.category === "string" ? t.category : "general",
  }));
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      return raw ? normalizeTasks(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CATS);
      if (!raw) return DEFAULT_CATEGORIES;
      const parsed = JSON.parse(raw);
      if (parsed.length > 0 && !parsed[0].cardBg) return DEFAULT_CATEGORIES;
      return parsed;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isGridView, setIsGridView] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(categories));
  }, [categories]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  function handleAddTask(title, categoryId, dueDate) {
    const clean = (title || "").trim();
    if (!clean) return;

    const catExists = categories.some((c) => c.id === categoryId);
    const finalCat = catExists ? categoryId : categories[0].id;

    const newTask = {
      id: crypto.randomUUID(),
      title: clean,
      completed: false,
      isImportant: false,
      createdAt: Date.now(),
      dueDate: dueDate,
      category: finalCat,
    };

    setTasks((prev) => [newTask, ...prev]);
    showNotification("משימה חדשה נוספה!");
  }

  function handleAddCategory(newCat) {
    setCategories(prev => [...prev, newCat]);
    showNotification(`קטגוריה "${newCat.label}" נוספה!`);
  }

  function handleToggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleToggleImportant(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isImportant: !t.isImportant } : t))
    );
  }

  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showNotification("המשימה נמחקה", "neutral");
  }

  function handleEditTask(id, nextTitle, nextCategory, nextDate) {
    const clean = (nextTitle || "").trim();
    if (!clean) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: clean, category: nextCategory, dueDate: nextDate } : t)));
    showNotification("המשימה עודכנה");
  }

  function handleClearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showNotification(`${count} משימות נמחקו`, "neutral");
  }

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
      })
      .filter((t) => (q ? t.title.toLowerCase().includes(q) : true))
      .sort((a, b) => (b.isImportant === a.isImportant ? 0 : b.isImportant ? 1 : -1));
  }, [tasks, query, filter]);

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-8 animate-in relative">
      <Notification show={notification.show} message={notification.message} type={notification.type} />

      <Card className="w-full max-w-5xl min-h-[85vh] flex flex-col overflow-hidden border-white/60 bg-white/80 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl ring-1 ring-white/50 rounded-3xl sm:rounded-[2.5rem]">
        
        <CardHeader className="space-y-6 sm:space-y-8 bg-gradient-to-b from-white/80 to-white/20 p-6 sm:p-10 border-b border-white/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1 text-center sm:text-right">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-600 drop-shadow-sm pb-2">
                המשימות שלי
              </h1>
              <p className="text-lg text-slate-500 font-medium">הפוך תוכניות להצלחות.</p>
            </div>
            
            <div className="flex gap-2 justify-center sm:justify-start">
              <Badge className="gap-2 rounded-xl bg-violet-100 px-4 py-2 text-violet-700 hover:bg-violet-200 border-0">
                <Circle className="h-4 w-4" />
                לביצוע: {activeCount}
              </Badge>
              <Badge className="gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-emerald-700 hover:bg-emerald-200 border-0">
                <CheckCircle2 className="h-4 w-4" />
                הושלם: {completedCount}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
             
             <div className="w-full sm:w-auto order-1">
               <TaskForm onAdd={handleAddTask} onAddCategory={handleAddCategory} categories={categories} />
             </div>
             <div className="w-full sm:flex-1 sm:mx-4 order-2 sm:order-2">
               <SearchBar query={query} onChange={setQuery} />
             </div>
             <div className="flex items-center gap-2 order-3 sm:order-3 w-full sm:w-auto justify-start">
                <FilterBar value={filter} onChange={setFilter} />
                <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsGridView(false)}
                    className={`h-8 w-8 p-0 rounded-lg ${!isGridView ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsGridView(true)}
                    className={`h-8 w-8 p-0 rounded-lg ${isGridView ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
             </div>
          </div>

        </CardHeader>

        <CardContent className="flex-1 p-0 bg-slate-50/50">
          <div className="p-4 sm:p-8 min-h-[300px]">
             <TaskList
              tasks={visibleTasks}
              categories={categories}
              isGridView={isGridView}
              onToggle={handleToggleTask}
              onToggleImportant={handleToggleImportant}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
        </CardContent>
        
        <div className="p-5 sm:p-6 bg-white border-t border-slate-100">
           <Footer
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
            />
        </div>
      </Card>
    </div>
  );
}