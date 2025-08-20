import { db, usingMock } from "@/src/lib/firebase";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, type QueryDocumentSnapshot, type DocumentData, type Timestamp } from "firebase/firestore";

export type SavedAnswer = {
  id?: string; // firestore doc id (optional)
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: number; // ms epoch for mock; Firestore uses serverTimestamp
  needsReview: boolean;
};

const mockKey = (uid: string | undefined) => `answers_${uid ?? "demo"}`;

export async function saveAnswer(uid: string | undefined, data: Omit<SavedAnswer, "answeredAt">) {
  if (usingMock) {
    const key = mockKey(uid);
    const arr: SavedAnswer[] = JSON.parse(localStorage.getItem(key) || "[]");
    const record: SavedAnswer = { ...data, answeredAt: Date.now() };
    arr.unshift(record);
    localStorage.setItem(key, JSON.stringify(arr));
    return { id: undefined };
  }
  // Firestore
  const col = collection(db, "users", uid ?? "demo", "answers");
  return await addDoc(col, {
    questionId: data.questionId,
    userAnswer: data.userAnswer,
    isCorrect: data.isCorrect,
    needsReview: data.needsReview,
    answeredAt: serverTimestamp(),
  });
}

export async function listAnswers(uid: string | undefined): Promise<SavedAnswer[]> {
  if (usingMock) {
    const key = mockKey(uid);
    const arr: SavedAnswer[] = JSON.parse(localStorage.getItem(key) || "[]");
    return arr;
  }
  const col = collection(db, "users", uid ?? "demo", "answers");
  const q = query(col, orderBy("answeredAt", "desc"));
  const snap = await getDocs(q);
  const res: SavedAnswer[] = [];
  snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
    const v = d.data() as { questionId: string; userAnswer: string; isCorrect: boolean; needsReview: boolean; answeredAt?: Timestamp };
    res.push({
      id: d.id,
      questionId: v.questionId,
      userAnswer: v.userAnswer,
      isCorrect: v.isCorrect,
      needsReview: v.needsReview,
      answeredAt: v.answeredAt ? v.answeredAt.toMillis() : Date.now(),
    });
  });
  return res;
}
