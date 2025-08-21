export type Question = {
  id: string;
  year: number;
  questionNumber: number;
  category: string;
  content: string;
  solution: string;
  explanation: string;
  // new optional fields
  difficulty?: "easy" | "medium" | "hard";
  type?: "input" | "single"; // input: free input, single: single-choice
  choices?: string[]; // when type === 'single'
  unit?: string; // e.g., 円, 万円
  rounding?: "round" | "ceil" | "floor"; // if numeric rounding is specified
};

const CUSTOM_KEY = "customQuestions";

// Lazy dynamic import to avoid circular import issues
async function loadMock(): Promise<{ mockQuestions: Question[] }> {
  const mod = await import("@/src/mock/questions");
  return { mockQuestions: (mod as any).mockQuestions as Question[] };
}

export async function getQuestions(): Promise<Question[]> {
  const { mockQuestions } = await loadMock();
  const customRaw = (typeof window !== "undefined") ? localStorage.getItem(CUSTOM_KEY) : null;
  if (!customRaw) return mockQuestions;
  try {
    const parsed = JSON.parse(customRaw) as Question[];
    // basic sanitize: ensure required fields exist
    const valid = parsed.filter(
      (q) => q && q.id && typeof q.year === "number" && typeof q.questionNumber === "number" && q.category && q.content && q.solution && q.explanation
    );
    // simple merge rule: prefer custom if id duplicates
    const customIds = new Set(valid.map((q) => q.id));
    const merged = [...valid, ...mockQuestions.filter((q) => !customIds.has(q.id))];
    return merged;
  } catch {
    return mockQuestions;
  }
}

export function saveCustomQuestions(data: Question[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(data));
}

export function clearCustomQuestions() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CUSTOM_KEY);
}
