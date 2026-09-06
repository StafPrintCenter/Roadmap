import { useCallback, useEffect, useState } from "react";

const KEY = "spc-upvotes";

type VoteMap = Record<string, number>;

function read(): VoteMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as VoteMap;
  } catch {
    return {};
  }
}

export function useUpvotes() {
  const [votes, setVotes] = useState<VoteMap>({});

  useEffect(() => {
    setVotes(read());
  }, []);

  const toggleVote = useCallback((id: string) => {
    setVotes((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const hasVoted = useCallback((id: string) => Boolean(votes[id]), [votes]);
  const bonus = useCallback((id: string) => (votes[id] ? 1 : 0), [votes]);

  return { votes, toggleVote, hasVoted, bonus };
}
