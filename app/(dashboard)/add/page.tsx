"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const AddExpense = () => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
  });

  const [categories, setCategories] = useState<string[]>([
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Education",
    "Health",
    "Bills & Utilities",
    "Other",
  ]);

  // 🧩 Fetch user categories from Firestore (Settings updates reflected here)
  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.categories && Array.isArray(userData.categories)) {
            setCategories(userData.categories);
          }
        }
      } catch (error) {
        console.error("Error fetching user categories:", error);
      }
    };

    fetchCategories();
  }, [userId]);

  // 💾 Add new expense to Firestore
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.name || !formData.amount || !formData.category) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   const amount = parseFloat(formData.amount);
  //   if (isNaN(amount) || amount <= 0) {
  //     toast.error("Amount must be greater than 0");
  //     return;
  //   }

  //   if (!user) {
  //     toast.error("Please log in first");
  //     return;
  //   }

  //   try {
  //     const expenseData = {
  //       name: formData.name.trim(),
  //       amount,
  //       category: formData.category,
  //       description: formData.description || "",
  //       date: date.toISOString(),
  //       createdAt: serverTimestamp(),
  //     };

  //     const expensesRef = collection(db, "users", userId, "expenses");
  //     await addDoc(expensesRef, expenseData);

  //     toast.success("✅ Expense added successfully!");

  //     // Reset form
  //     setFormData({
  //       name: "",
  //       amount: "",
  //       category: "",
  //       description: "",
  //     });
  //     setDate(new Date());
  //   } catch (error) {
  //     console.error("❌ Error adding expense:", error);
  //     toast.error("Failed to add expense. Please try again.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.amount || !formData.category) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (parseFloat(formData.amount) <= 0) {
    toast.error("Amount must be greater than 0");
    return;
  }

  if (!user || !user.id) {
    toast.error("Please log in first");
    return;
  }

  if (!date) {
    toast.error("Please select a date");
    return;
  }

  try {
    // ✅ Safe reference using definite user.id
    const expensesRef = collection(db, "users", user.id, "expenses");

    await addDoc(expensesRef, {
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description || "",
      date: date.toISOString(),
      createdAt: serverTimestamp(),
    });

    toast.success("✅ Expense added successfully!");
    setFormData({
      name: "",
      amount: "",
      category: "",
      description: "",
    });
    setDate(new Date());
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    toast.error("Failed to add expense. Please try again.");
  }
};

  return (
    <div className="flex flex-col">
      <div>
        <h5 className="text-4xl uppercase font-bold font-raleway text-primary">
          Add Expense
        </h5>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="relative overflow-hidden border border-blue-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#1E293B] shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-transparent pointer-events-none" />

          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Add New Expense
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Expense Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-semibold text-blue-900 dark:text-blue-200"
                >
                  Expense Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Lunch at cafeteria"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="font-semibold text-blue-900 dark:text-blue-200"
                  >
                    Amount (₦) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-blue-900 dark:text-blue-200">
                    Date *
                  </Label>
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
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="font-semibold text-blue-900 dark:text-blue-200"
                >
                  Category *
                </Label>
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
                <Label
                  htmlFor="description"
                  className="font-semibold text-blue-900 dark:text-blue-200"
                >
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional notes..."
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add Expense
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
