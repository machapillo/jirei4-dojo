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

// Optionally load extra questions if present
async function loadExtra(): Promise<Question[]> {
  try {
    const mod = await import("@/src/mock/questions-extra");
    const anyMod = mod as any;
    return (
      anyMod.extraQuestionsAll3 ||
      anyMod.extraQuestionsAll ||
      anyMod.extraQuestions ||
      []
    ) as Question[];
  } catch {
    return [];
  }
}

export async function getQuestions(): Promise<Question[]> {
  const { mockQuestions } = await loadMock();
  const extra = await loadExtra();
  const customRaw = (typeof window !== "undefined") ? localStorage.getItem(CUSTOM_KEY) : null;
  if (!customRaw) return [...mockQuestions, ...extra];
  try {
    const parsed = JSON.parse(customRaw) as Question[];
    // basic sanitize: ensure required fields exist
    const valid = parsed.filter(
      (q) => q && q.id && typeof q.year === "number" && typeof q.questionNumber === "number" && q.category && q.content && q.solution && q.explanation
    );
    // simple merge rule: prefer custom if id duplicates
    const customIds = new Set(valid.map((q) => q.id));
    const baseMerged = [...mockQuestions, ...extra];
    const merged = [...valid, ...baseMerged.filter((q) => !customIds.has(q.id))];
    return merged;
  } catch {
    return [...mockQuestions, ...extra];
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
