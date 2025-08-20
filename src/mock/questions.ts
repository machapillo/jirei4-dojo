export type Question = {
  id: string;
  year: number;
  questionNumber: number;
  category: string; // e.g., "CVP", "NPV"
  content: string;
  solution: string; // string for simplicity; numeric answers can also be strings
  explanation: string;
};

export const mockQuestions: Question[] = [
  {
    id: "q1",
    year: 2021,
    questionNumber: 1,
    category: "CVP",
    content:
      "製品Aの販売価格は1,000円、変動費は600円、固定費は200,000円である。損益分岐点売上高はいくらか。",
    solution: "500000", // (固定費) / (貢献利益率=400/1000) = 200000 / 0.4 = 500000
    explanation:
      "損益分岐点売上高 = 固定費 / 貢献利益率。貢献利益率 = (1,000-600)/1,000 = 0.4。よって 200,000/0.4 = 500,000円。",
  },
  {
    id: "q2",
    year: 2020,
    questionNumber: 2,
    category: "NPV",
    content:
      "初期投資600,000円、1〜3年目のキャッシュフローが各250,000円、割引率10%のNPVを最も近い整数で求めよ。",
    solution: "25500", // 250000/1.1 + 250000/1.1^2 + 250000/1.1^3 - 600000 ≈ 25,500
    explanation:
      "NPV = Σ(CF_t/(1+r)^t) - 初期投資。r=10%。概算で 227,272 + 206,611 + 187,828 - 600,000 ≈ 25,711 → 25,500程度。",
  },
];
