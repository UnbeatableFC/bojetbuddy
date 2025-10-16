import { StatsData, Suggestion } from "@/types/types";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export const useAISuggestions = (
  userId: string,
  stats: StatsData | null
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Keep track of previous stats to detect changes
  const prevStatsRef = useRef<string>("");

  // ✅ Define fetchSuggestions outside useEffect using useCallback
  const fetchSuggestions = useCallback(async () => {
    if (!userId || !stats) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });

      if (!res.ok) {
        console.error("Failed to fetch AI suggestions:", res.statusText);
        return;
      }

      const data = await res.json();
      if (data.suggestions) setSuggestions(data.suggestions);
      toast.success("✨ AI Suggestions Updated")
      console.log("✅ AI suggestions received:", data);

    } catch (err) {
      console.error("❌ AI Suggestion Error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, stats]);

  // ✅ Automatically trigger only when stats change
  useEffect(() => {
    if (!userId || !stats) return;

    const currentStatsString = JSON.stringify(stats);
    if (currentStatsString === prevStatsRef.current) return;

    prevStatsRef.current = currentStatsString;
    fetchSuggestions();
  }, [userId, stats, fetchSuggestions]);

  // ✅ Return the function for manual regeneration
  return { suggestions, loading, refetchSuggestions: fetchSuggestions };
};
