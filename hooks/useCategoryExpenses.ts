import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust import path if needed
import { CategoryExpense } from "@/types/types";



export const useCategoryExpenses = (userId: string) => {
  const [categories, setCategories] = useState<CategoryExpense[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategoryExpenses = async () => {
//       if (!userId) return;

//       setLoading(true);
//       try {
//         const q = query(collection(db, "users", userId, "expenses"));
//         const querySnapshot = await getDocs(q);

//         // Group by category
//         const categoryTotals: Record<string, number> = {};

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const category = data.category || "Uncategorized";
//           const amount = Number(data.amount) || 0;

//           if (!categoryTotals[category]) categoryTotals[category] = 0;
//           categoryTotals[category] += amount;
//         });

//         // Convert to array
//         const formatted = Object.entries(categoryTotals).map(
//           ([name, amount]) => ({
//             name,
//             amount,
//           })
//         );

//         setCategories(formatted);
//       } catch (error) {
//         console.error("Error fetching category expenses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryExpenses();
//   }, [userId]);

useEffect(() => {
  if (!userId) return;

  const q = query(collection(db, "users", userId, "expenses"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const categoryTotals: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category || "Uncategorized";
      const amount = Number(data.amount) || 0;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    const formatted = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
    }));

    setCategories(formatted);
    setLoading(false);
    console.log("This fetched too")
  });

  return () => unsubscribe();
}, [userId]);
  return { categories, loading };
};
