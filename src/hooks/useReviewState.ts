import { useEffect, useState } from "react";

export type ReviewerRole = "Privacy" | "Security" | "Engineering" | "Legal";

export interface Signoff {
  role: ReviewerRole;
  name: string;
  at: string;
}

export interface Comment {
  id: string;
  section: string;
  author: string;
  text: string;
  at: string;
}

export interface ReviewState {
  signoffs: Signoff[];
  comments: Comment[];
}

const empty: ReviewState = { signoffs: [], comments: [] };
const key = (id: string) => `priveria.review.${id}`;

/**
 * Persists per-assessment review sign-offs and comments in localStorage.
 * Sign-off logic: an assessment is "Approved" once at least one Privacy reviewer
 * and at least one non-Privacy reviewer have both signed off.
 */
export function useReviewState(assessmentId: string) {
  const [state, setState] = useState<ReviewState>(empty);

  useEffect(() => {
    if (!assessmentId) return;
    try {
      setState(JSON.parse(localStorage.getItem(key(assessmentId)) || "null") || empty);
    } catch {
      setState(empty);
    }
  }, [assessmentId]);

  const persist = (next: ReviewState) => {
    setState(next);
    localStorage.setItem(key(assessmentId), JSON.stringify(next));
  };

  const addSignoff = (role: ReviewerRole, name: string) => {
    const filtered = state.signoffs.filter((s) => s.role !== role);
    persist({ ...state, signoffs: [...filtered, { role, name, at: new Date().toISOString() }] });
  };
  const removeSignoff = (role: ReviewerRole) =>
    persist({ ...state, signoffs: state.signoffs.filter((s) => s.role !== role) });

  const addComment = (section: string, author: string, text: string) =>
    persist({
      ...state,
      comments: [
        ...state.comments,
        { id: crypto.randomUUID(), section, author, text, at: new Date().toISOString() },
      ],
    });

  const hasPrivacy = state.signoffs.some((s) => s.role === "Privacy");
  const hasOther = state.signoffs.some((s) => s.role !== "Privacy");
  const approved = hasPrivacy && hasOther;
  const status: "Pending" | "In Review" | "Approved" =
    state.signoffs.length === 0 ? "Pending" : approved ? "Approved" : "In Review";

  return { state, addSignoff, removeSignoff, addComment, approved, status };
}
