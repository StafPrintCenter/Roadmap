import { useCallback, useEffect, useState } from "react";
import type { RoadmapFeature } from "@/data/featuresData";

const KEY = "spc-submissions";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<RoadmapFeature[]>([]);

  useEffect(() => {
    try {
      setSubmissions(JSON.parse(localStorage.getItem(KEY) ?? "[]") as RoadmapFeature[]);
    } catch {
      setSubmissions([]);
    }
  }, []);

  const addSubmission = useCallback((feature: RoadmapFeature) => {
    setSubmissions((prev) => {
      const next = [feature, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { submissions, addSubmission };
}
