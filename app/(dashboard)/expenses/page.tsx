"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Filter, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { Expense } from "@/types/types";
import { toast } from "sonner";
// import { useToast } from "@/components/ui/use-toast";

const ExpensesList = () => {
  const { user } = useUser();
  // const { toast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
  });
  const [date, setDate] = useState<Date | null>(null);

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Education",
    "Shopping",
    "Health",
    "Utilities",
    "Other",
  ];

  // 🔥 Fetch expenses
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.id, "expenses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userExpenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
      setExpenses(userExpenses);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 🎯 Filtering
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      const matchesAmount =
        amountFilter === "all" ||
        (amountFilter === "low" && expense.amount < 2000) ||
        (amountFilter === "medium" &&
          expense.amount >= 2000 &&
          expense.amount < 10000) ||
        (amountFilter === "high" && expense.amount >= 10000);

      return matchesSearch && matchesCategory && matchesAmount;
    });
  }, [expenses, searchTerm, categoryFilter, amountFilter]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
      Transportation:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
      Entertainment:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
      Education:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
      Shopping:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      Health:
        "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
      Utilities:
        "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  // ✏️ Open Edit Modal
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || "",
    });
    setDate(new Date(expense.date));
    setIsModalOpen(true);
  };

  // 💾 Update expense
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingExpense) return;

    try {
      const ref = doc(db, "users", user.id, "expenses", editingExpense.id);
      await updateDoc(ref, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: date ? date.toISOString() : editingExpense.date,
      });

      toast.success("Expense updated successfully ✅");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update expense ❌");
    }
  };

  // 🗑️ Delete expense
  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteDoc(doc(db, "users", user.id, "expenses", id));
      toast.success("Expense deleted successfully 🗑️" );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense ❌");
    }
  };

  if (!user)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Please log in to view your expenses.
      </div>
    );

  return (
    <div className="space-y-8">
      {/* === MAIN CARD === */}
      <Card className="shadow-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading tracking-tight">
            All Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* === FILTERS === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-sans"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="font-sans">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="font-sans">
                <SelectValue placeholder="Filter by amount" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="low">Under ₦2000</SelectItem>
                <SelectItem value="medium">₦2000 - ₦10000</SelectItem>
                <SelectItem value="high">Over ₦10000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* === EXPENSES TABLE === */}
          <div className="rounded-xl border border-border overflow-hidden">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading expenses...
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <p className="font-medium">{expense.name}</p>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">
                            {expense.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getCategoryColor(
                            expense.category
                          )} border`}
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.date
                          ? format(new Date(expense.date), "MMM dd, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₦{expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* === EDIT MODAL === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl mx-auto p-0 border border-blue-100 dark:border-slate-800 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100/70 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#1E293B] shadow-lg">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-4xl uppercase font-bold font-raleway text-primary">
              Edit Expense
            </DialogTitle>
          </DialogHeader>

          <CardContent className="p-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label>Expense Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₦) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-blue-100 dark:border-slate-700 hover:border-blue-400/60"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white">
                      <Calendar
                        mode="single"
                        selected={date || new Date()}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="border-blue-100 dark:border-slate-700 hover:border-blue-400/60">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesList;
