"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Plus, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const Settings = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>("");

  // 🧩 Fetch user data (budget + categories)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setMonthlyBudget(data.monthlyBudget || 0);
          setBudgetInput(String(data.monthlyBudget || ""));
          setCategories(
            data.categories && Array.isArray(data.categories)
              ? data.categories
              : [
                  "Food & Dining",
                  "Transportation",
                  "Entertainment",
                  "Education",
                  "Shopping",
                  "Health",
                  "Bills & Utilities",
                  "Other",
                ]
          );
        } else {
          // create user doc with defaults if not found
          await setDoc(userRef, {
            monthlyBudget: 0,
            categories: [
              "Food & Dining",
              "Transportation",
              "Entertainment",
              "Education",
              "Shopping",
              "Health",
              "Bills & Utilities",
              "Other",
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // 💾 Save or update monthly budget
  const handleSaveBudget = async () => {
    if (!userId) return toast.error("User not found");
    const value = Number(budgetInput);

    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { monthlyBudget: value }, { merge: true });
      setMonthlyBudget(value);
      toast.success("Monthly budget updated successfully");
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to update monthly budget");
    }
  };

  // ➕ Add Category
  const handleAddCategory = async () => {
    if (!userId) return toast.error("User not found");
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const formatted = newCategory.trim();

    if (categories.includes(formatted)) {
      toast.error("Category already exists");
      return;
    }

    const updatedCategories = [...categories, formatted];

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { categories: updatedCategories });
      setCategories(updatedCategories);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // ✏️ Edit Category
  const handleEditCategory = async (oldName: string) => {
    if (!userId) return toast.error("User not found");
    if (!editValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const newName = editValue.trim();

    if (categories.includes(newName) && newName !== oldName) {
      toast.error("Category already exists");
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat === oldName ? newName : cat
    );

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { categories: updatedCategories });
      setCategories(updatedCategories);
      setEditingCategory(null);
      setEditValue("");
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // 🗑️ Delete Category
  const handleDeleteCategory = async (categoryName: string) => {
    if (!userId) return toast.error("User not found");
    const updatedCategories = categories.filter((cat) => cat !== categoryName);

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { categories: updatedCategories });
      setCategories(updatedCategories);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  // 🚨 Clear all expenses
  const handleClearAllExpenses = async () => {
    if (!userId) return toast.error("User not found");
    try {
      const expensesRef = collection(db, "users", userId, "expenses");
      const snapshot = await getDocs(expensesRef);
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
      toast.success("All expenses cleared successfully");
    } catch (error) {
      console.error("Error clearing expenses:", error);
      toast.error("Failed to clear expenses");
    }
  };

  return (
    <div className="space-y-8">
      {/* 💰 Monthly Budget */}
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-none shadow-lg hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-heading bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Monthly Budget
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Set or update your monthly spending limit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              placeholder="Enter your monthly budget..."
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="max-w-xs bg-white/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            />
            <Button
              onClick={handleSaveBudget}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
            >
              Save Budget
            </Button>
          </div>
          {monthlyBudget > 0 && (
            <p className="text-sm text-muted-foreground">
              Current monthly budget:{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ₦{monthlyBudget.toLocaleString()}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* 🏷️ Category Management */}
      <Card className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-none shadow-lg hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-heading bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Manage Categories
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Add, edit, or remove your expense categories
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add New Category */}
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              className="bg-white/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            />
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Current Categories</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 border rounded-xl bg-white/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  {editingCategory === category ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleEditCategory(category)
                        }
                        autoFocus
                        className="bg-white/70 dark:bg-slate-800/50"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCategory(null);
                          setEditValue("");
                        }}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-slate-700 dark:text-slate-200 font-heading">
                        {category}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category);
                            setEditValue(category);
                          }}
                          className="hover:bg-indigo-100 dark:hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4 text-indigo-500" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-red-100 dark:hover:bg-slate-700"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &ldquo;{category}&ldquo;?
                                This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🚨 Danger Zone */}
      <Card className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-none shadow-lg hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-heading bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Irreversible actions that affect your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl bg-red-50/70 dark:bg-red-950/40 backdrop-blur">
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">
                Clear All Expenses
              </h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete all your expense records
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your expenses and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllExpenses}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
