import { StatsData, Suggestion } from "@/types/types";
import { useEffect, useState, useRef } from "react";

export const useAISuggestions = (
  userId: string,
  stats: StatsData | null
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Keep track of previous stats to detect changes
  const prevStatsRef = useRef<StatsData | null>(null);

  useEffect(() => {
    if (!userId || !stats) return;

    // Convert stats to JSON string for shallow comparison
    const currentStatsString = JSON.stringify(stats);
    const prevStatsString = JSON.stringify(prevStatsRef.current);

    // Only trigger API if stats actually changed
    if (currentStatsString === prevStatsString) return;

    prevStatsRef.current = stats;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stats }),
        });

        if (!res.ok) {
          console.error(
            "Failed to fetch AI suggestions:",
            res.statusText
          );
          return;
        }

        const data = await res.json();
        if (data.suggestions) setSuggestions(data.suggestions);
        console.log("This worked well" , {data})
      } catch (err) {
        console.error("AI Suggestion Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId, stats]);

  return { suggestions, loading };
};
