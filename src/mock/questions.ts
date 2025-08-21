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
  // 2021
  {
    id: "q1",
    year: 2021,
    questionNumber: 1,
    category: "CVP",
    content:
      "製品Aの販売価格は1,000円、変動費は600円、固定費は200,000円である。損益分岐点売上高はいくらか。",
    solution: "500000",
    explanation:
      "損益分岐点売上高 = 固定費 / 貢献利益率。貢献利益率 = (1,000-600)/1,000 = 0.4。よって 200,000/0.4 = 500,000円。",
  },
  {
    id: "q1b",
    year: 2021,
    questionNumber: 2,
    category: "NPV",
    content:
      "初期投資600,000円、1〜3年目のCFが各250,000円、割引率10%のNPVを最も近い整数で求めよ。",
    solution: "25500",
    explanation:
      "NPV = Σ(CF_t/(1+r)^t) - 初期投資。r=10%。概算で 227,272 + 206,611 + 187,828 - 600,000 ≈ 25,711 → 25,500程度。",
  },
  // 2020
  {
    id: "q2",
    year: 2020,
    questionNumber: 1,
    category: "在庫",
    content:
      "需要年1,200個、発注費用3,000円/回、在庫保管費20円/個のEOQ（最適発注量）を最も近い整数で求めよ。",
    solution: "600", // sqrt(2DS/H) = sqrt(2*1200*3000/20)= sqrt(360000)=600
    explanation:
      "EOQ = √(2DS/H)。D=1,200, S=3,000, H=20 → √(360,000)=600個。",
  },
  {
    id: "q2b",
    year: 2020,
    questionNumber: 2,
    category: "CVP",
    content:
      "固定費150,000円、販売価格2,000円、変動費1,200円。損益分岐点数量はいくつか。",
    solution: "188", // 150000/(2000-1200)=150000/800=187.5 → 188
    explanation:
      "損益分岐点数量 = 固定費 / （販売価格-変動費）。187.5より切上げで188個。",
  },
  // 2019
  {
    id: "q3",
    year: 2019,
    questionNumber: 1,
    category: "NPV",
    content:
      "初期投資800,000円、1〜4年目CFが各260,000円、割引率8%のNPV（最も近い整数）。",
    solution: "115000", // 概算で約915,000-800,000=115,000
    explanation:
      "NPV = Σ(CF/(1+0.08)^t) - 800,000 ≈ 115,000円（概算）。",
  },
  {
    id: "q3b",
    year: 2019,
    questionNumber: 2,
    category: "原価計算",
    content:
      "材料費300、労務費200、製造間接費は直接作業時間2時間に対し1時間あたり150。製品1個の製造原価はいくらか。",
    solution: "650", // 300+200+(2*150)=650
    explanation:
      "製造原価 = 材料費+労務費+製造間接費(150×2h)=650。",
  },
  // 2022
  {
    id: "q4",
    year: 2022,
    questionNumber: 1,
    category: "CVP",
    content:
      "販売価格1,500円、変動費900円、固定費300,000円。安全余裕率が20%のとき、実際売上高はいくらか。",
    solution: "937500",
    explanation:
      "損益分岐点売上高 = 300,000/((1,500-900)/1,500)=300,000/0.4=750,000。安全余裕率= (実際売上-損益分岐点)/実際売上=0.2 ⇒ 実際売上=750,000/0.8=937,500円。",
  },
  {
    id: "q4b",
    year: 2022,
    questionNumber: 2,
    category: "在庫",
    content:
      "年需要2,400個、発注費用2,000円/回、在庫保管費25円/個。EOQ（最適発注量）を求めよ。",
    solution: "620",
    explanation:
      "EOQ=√(2DS/H)=√(2×2400×2000/25)=√(384,000)≈620個。",
  },
  {
    id: "q4c",
    year: 2022,
    questionNumber: 3,
    category: "財務比率",
    content:
      "流動資産600、流動負債400。流動比率（%）を最も近い整数で求めよ。",
    solution: "150",
    explanation:
      "流動比率 = 600/400×100=150%。",
  },
  // 2018
  {
    id: "q5",
    year: 2018,
    questionNumber: 1,
    category: "NPV",
    content:
      "初期投資1,000,000円、1〜3年目CFが300,000/350,000/400,000円、割引率5%。NPVを最も近い整数で求めよ。",
    solution: "-51316",
    explanation:
      "現在価値: 300,000/1.05=285,714、350,000/1.05^2≈317,460、400,000/1.05^3≈345,510。合計≈948,684。NPV=948,684-1,000,000≈-51,316。",
  },
  {
    id: "q5b",
    year: 2018,
    questionNumber: 2,
    category: "原価計算",
    content:
      "直接材料200、直接労務150、製造間接費は直接作業時間3h×100/h。製造原価は。",
    solution: "650",
    explanation:
      "200+150+(3×100)=650。",
  },
  {
    id: "q5c",
    year: 2018,
    questionNumber: 3,
    category: "財務比率",
    content:
      "売上高5,000、売上総利益率40%。売上原価はいくらか。",
    solution: "3000",
    explanation:
      "売上総利益=5,000×0.4=2,000。売上原価=5,000-2,000=3,000。",
  },
  // 2017
  {
    id: "q6",
    year: 2017,
    questionNumber: 1,
    category: "CVP",
    content:
      "販売価格2,500円、変動費1,500円、固定費500,000円。目標利益100,000円を得るのに必要な販売数量（個）を最も近い整数で求めよ。",
    solution: "600",
    explanation:
      "必要数量 = (固定費+目標利益)/(販売価格-変動費)=(500,000+100,000)/1,000=600個。",
  },
  {
    id: "q6b",
    year: 2017,
    questionNumber: 2,
    category: "在庫",
    content:
      "EOQ=500個、年需要2,000個、年間稼働日数250日。発注間隔（日）を最も近い整数で求めよ。",
    solution: "63",
    explanation:
      "1年の発注回数=2000/500=4回。間隔=250/4=62.5→63日。",
  },
  {
    id: "q6c",
    year: 2017,
    questionNumber: 3,
    category: "財務比率",
    content:
      "総資産2,000、自己資本1,000、当期純利益100。ROA（%）を最も近い整数で求めよ。",
    solution: "5",
    explanation:
      "ROA=当期純利益/総資産×100=100/2000×100=5%。",
  },
  // 2023 追加
  {
    id: "q7",
    year: 2023,
    questionNumber: 1,
    category: "NPV",
    content:
      "初期投資500,000円、1〜4年目のCFが150,000/150,000/150,000/150,000、割引率6%。NPVを最も近い整数で求めよ。",
    solution: "19750",
    explanation:
      "年金現価係数(6%,4年)≈3.465。現在価値=150,000×3.465=519,750。NPV=519,750-500,000≈19,750。",
  },
  {
    id: "q7b",
    year: 2023,
    questionNumber: 2,
    category: "原価計算",
    content:
      "標準数量10kg×単価50、実際数量12kg×単価55。材料価格差異（有利/不利、金額）を求めよ（不利は正の数値で入力）。",
    solution: "60",
    explanation:
      "価格差異=(実際単価-標準単価)×実際数量=(55-50)×12=60。不利60。",
  },
  {
    id: "q7c",
    year: 2023,
    questionNumber: 3,
    category: "財務比率",
    content:
      "売上高10,000、営業利益800。営業利益率（%）を最も近い整数で求めよ。",
    solution: "8",
    explanation:
      "800/10,000×100=8%。",
  },
  // 練習用追加（年度混在）
  {
    id: "q8",
    year: 2021,
    questionNumber: 3,
    category: "CVP",
    content:
      "複数製品のうち製品Bのみを考える。価格3,000、変動費1,800、固定費は全社で400,000。製品Bのみ販売の場合、損益分岐点数量は。",
    solution: "333",
    explanation:
      "固定費/（3,000-1,800）=400,000/1,200=333.33→333個（端数切捨て/最も近い整数は333）。",
  },
  {
    id: "q9",
    year: 2020,
    questionNumber: 3,
    category: "在庫",
    content:
      "EOQモデルで在庫保管費率が年10%、単価2,000円、需要年1,000個、発注費3,000円/回。EOQは。",
    solution: "173",
    explanation:
      "H=単価×保管費率=2,000×0.1=200。EOQ=√(2DS/H)=√(2×1000×3000/200)=√(30,000)≈173個。",
  },
  {
    id: "q10",
    year: 2019,
    questionNumber: 3,
    category: "財務比率",
    content:
      "当期純利益120、自己資本1,500。ROE（%）を最も近い整数で求めよ。",
    solution: "8",
    explanation:
      "ROE=120/1,500×100=8%。",
  },
  {
    id: "q11",
    year: 2018,
    questionNumber: 4,
    category: "原価計算",
    content:
      "加工進捗度50%の仕掛品が期末に100個、単価（材料200、加工300）。加重平均法で期末仕掛品原価はいくらか（材料は期首投入）。",
    solution: "35000",
    explanation:
      "材料は全額計上=200×100=20,000。加工は50%×300×100=15,000。合計35,000。",
  },
  {
    id: "q12",
    year: 2022,
    questionNumber: 4,
    category: "NPV",
    content:
      "初期投資400,000、1〜3年目CFが180,000/150,000/120,000、割引率12%。NPVを最も近い整数で。",
    solution: "-34329",
    explanation:
      "PV=180,000/1.12+150,000/1.12^2+120,000/1.12^3≈160,714+119,658+85,299=365,671。NPV=365,671-400,000≈-34,329。",
  },
  {
    id: "q13",
    year: 2023,
    questionNumber: 4,
    category: "CVP",
    content:
      "販売価格4,000、変動費2,800、固定費900,000。損益分岐点売上高はいくらか。",
    solution: "3000000",
    explanation:
      "貢献利益率=(4,000-2,800)/4,000=0.3。損益分岐点売上高=900,000/0.3=3,000,000円。",
  },
  {
    id: "q14",
    year: 2017,
    questionNumber: 4,
    category: "財務比率",
    content:
      "売上高回転率=売上高/総資産。売上高12,000、総資産3,000。売上高回転率（回）を求めよ。",
    solution: "4",
    explanation:
      "12,000/3,000=4回。",
  },
  {
    id: "q15",
    year: 2021,
    questionNumber: 4,
    category: "在庫",
    content:
      "需要年9,000個、発注費用1,000円/回、在庫保管費50円/個。EOQは。",
    solution: "600",
    explanation:
      "EOQ=√(2×9,000×1,000/50)=√(360,000)=600個。",
  },
];

