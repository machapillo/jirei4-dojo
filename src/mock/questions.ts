export type Question = {
  id: string;
  year: number;
  questionNumber: number;
  category: string; // e.g., "CVP", "NPV"
  content: string;
  solution: string; // string for simplicity; numeric answers can also be strings
  explanation: string;
  // Optional fields aligned with lib/questionSource.ts
  difficulty?: "easy" | "medium" | "hard";
  type?: "input" | "single";
  choices?: string[];
  unit?: string;
  rounding?: "round" | "ceil" | "floor";
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
    difficulty: "easy",
    unit: "円",
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
    difficulty: "medium",
    unit: "円",
    rounding: "round",
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
    difficulty: "easy",
    unit: "個",
    rounding: "round",
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
    rounding: "round",
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
    difficulty: "easy",
    unit: "円",
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
    difficulty: "easy",
    unit: "%",
    rounding: "round",
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
    rounding: "round",
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
    difficulty: "easy",
    unit: "円",
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
    rounding: "round",
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
    rounding: "round",
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
    difficulty: "easy",
    unit: "%",
    rounding: "round",
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
    rounding: "round",
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
    difficulty: "easy",
    unit: "%",
    rounding: "round",
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
    rounding: "round",
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
    difficulty: "medium",
    unit: "円",
    rounding: "round",
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
  {
    id: "q16",
    year: 2024,
    questionNumber: 1,
    category: "WACC",
    content:
      "自己資本コスト8%、負債コスト3%、税率30%。資本構成は自己資本60%、負債40%。WACC（%）を最も近い整数で求めよ。",
    solution: "6",
    explanation:
      "WACC=0.6×8%+0.4×3%×(1-0.3)=4.8%+0.84%=5.64%→約6%。",
    difficulty: "hard",
    unit: "%",
    rounding: "round",
  },
  {
    id: "q17",
    year: 2024,
    questionNumber: 2,
    category: "関連原価",
    content:
      "特注受注の可否。追加固定費20,000円、単価2,000円、変動費1,400円、受注数量50個。他製品への影響なし。採算はプラスか（プラスなら1、マイナスなら0）。",
    solution: "1",
    explanation:
      "増分利益=(2,000-1,400)×50 - 20,000 = 30,000 - 20,000 = +10,000でプラス(1)。",
    difficulty: "medium",
    type: "single",
    choices: ["0", "1"],
  },
  {
    id: "q18",
    year: 2024,
    questionNumber: 3,
    category: "線形計画",
    content:
      "製品X,Yの利潤は5,4。制約: 2X+Y≤8, X+2Y≤8, X,Y≥0。最大利潤（最も近い整数）。",
    solution: "24",
    explanation:
      "交点X=8/3,Y=8/3で目的=5×8/3+4×8/3=24が最大。",
    difficulty: "hard",
    rounding: "round",
  },
  {
    id: "q19",
    year: 2024,
    questionNumber: 4,
    category: "待ち行列",
    content:
      "M/M/1、到着率λ=4/時、サービス率μ=6/時。系内平均顧客数Lを最も近い整数で。",
    solution: "2",
    explanation:
      "ρ=4/6=0.667、L=ρ/(1-ρ)=0.667/0.333≈2。",
    difficulty: "hard",
    rounding: "round",
  },
  {
    id: "q20",
    year: 2024,
    questionNumber: 5,
    category: "PERT/CPM",
    content:
      "作業A(1,2,5)、B(2,3,8)が直列。期待工期(β近似)の合計（最も近い整数）。",
    solution: "6",
    explanation:
      "E=(a+4m+b)/6。A=2.33、B=3.67、合計≈6。",
    difficulty: "hard",
    unit: "日",
    rounding: "round",
  },
  {
    id: "q21",
    year: 2023,
    questionNumber: 5,
    category: "WACC",
    content:
      "自己資本比率80%、自己資本コスト7%、負債比率20%、負債コスト2%、税率40%。WACC（%）を最も近い整数で。",
    solution: "6",
    explanation:
      "0.8×7% + 0.2×2%×(1-0.4) = 5.6% + 0.24% = 5.84% → 約6。",
    difficulty: "medium",
    unit: "%",
    rounding: "round",
  },
  {
    id: "q22",
    year: 2022,
    questionNumber: 5,
    category: "感度分析",
    content:
      "CVP: P=2,500、V=1,800、F=420,000。Pが2%低下時の損益分岐点数量の増加幅（個、最も近い整数）。",
    solution: "46",
    explanation:
      "元Qb=420,000/700=600。P↓で寄与=650、Qb≈646。差≈46。",
    difficulty: "hard",
    unit: "個",
    rounding: "round",
  },
  {
    id: "q23",
    year: 2021,
    questionNumber: 5,
    category: "セールスミックス",
    content:
      "A(価格4,000,変動費2,400)×2、B(価格3,000,変動費2,400)×1のセット。固定費1,900,000。複合損益分岐点数量（セット数）。",
    solution: "500",
    explanation:
      "1セット寄与=1,600×2+600=3,800。Q=1,900,000/3,800=500セット。",
    difficulty: "hard",
  },
  {
    id: "q24",
    year: 2020,
    questionNumber: 5,
    category: "為替",
    content:
      "USD/JPYが110→121。円安率（%、最も近い整数）。",
    solution: "10",
    explanation:
      "(121-110)/110×100≈10%。",
    difficulty: "medium",
    unit: "%",
    rounding: "round",
  },
  {
    id: "q25",
    year: 2019,
    questionNumber: 5,
    category: "キャッシュフロー",
    content:
      "減価償却200、税引前利益500、法人税100、運転資本増加50。フリーキャッシュフロー(FCF)。",
    solution: "550",
    explanation:
      "(500-100)+200-50=550。",
    difficulty: "hard",
  },
  {
    id: "q26",
    year: 2018,
    questionNumber: 5,
    category: "回帰分析",
    content:
      "単回帰 y=2+3x。x=10時の予測y。",
    solution: "32",
    explanation:
      "2+3×10=32。",
    difficulty: "easy",
  },
  {
    id: "q27",
    year: 2024,
    questionNumber: 6,
    category: "原価差異",
    content:
      "材料標準:10kg×40。実際:12kg×35。数量差異（不利は正）。",
    solution: "80",
    explanation:
      "(12-10)×40=80。不利80。",
    difficulty: "medium",
  },
  {
    id: "q28",
    year: 2024,
    questionNumber: 7,
    category: "NPV",
    content:
      "初期投資900,000、CF:各年250,000(5年)、r=9%。NPV（最も近い整数）。",
    solution: "72250",
    explanation:
      "年金現価係数(9%,5)≈3.889。PV=250,000×3.889=972,250。NPV=72,250。",
    difficulty: "hard",
    unit: "円",
    rounding: "round",
  },
  {
    id: "q29",
    year: 2023,
    questionNumber: 6,
    category: "単位換算",
    content:
      "在庫回転日数=365/回転率。回転率7回/年のとき回転日数（最も近い整数）。",
    solution: "52",
    explanation:
      "365/7≈52.14→52。",
    difficulty: "easy",
    unit: "日",
    rounding: "round",
  },
  {
    id: "q30",
    year: 2022,
    questionNumber: 6,
    category: "CVP",
    content:
      "目標利益200,000、価格3,500、変動費2,600、固定費1,000,000。必要売上高（円）。",
    solution: "4666667",
    explanation:
      "寄与率=900/3500≈0.2571。必要売上=(1,200,000)/0.2571≈4,666,667円。",
    difficulty: "medium",
    unit: "円",
    rounding: "round",
  },
  {
    id: "q31",
    year: 2021,
    questionNumber: 6,
    category: "デリバティブ",
    content:
      "コールのデルタ0.6、基礎資産が10円上昇。オプション理論価格の変化（円）。",
    solution: "6",
    explanation:
      "0.6×10=6。",
    difficulty: "hard",
    unit: "円",
    rounding: "round",
  },
  {
    id: "q32",
    year: 2020,
    questionNumber: 6,
    category: "原価計算",
    content:
      "仕損率5%、投入1,000個、材料単価100。正常仕損で材料の良品単位当り負担増（円）。",
    solution: "5",
    explanation:
      "良品=950、単価増=100×(1/0.95-1)≈5。",
    difficulty: "hard",
    unit: "円",
    rounding: "round",
  },
  {
    id: "q33",
    year: 2019,
    questionNumber: 6,
    category: "財務比率",
    content:
      "当座比率=(当座資産)/流動負債。現金200、売掛300、棚卸400、流動負債600。(%）。",
    solution: "83",
    explanation:
      "(200+300)/600=0.833→83%。",
    difficulty: "medium",
    unit: "%",
    rounding: "round",
  },
  {
    id: "q34",
    year: 2018,
    questionNumber: 6,
    category: "NPV",
    content:
      "初期投資700,000、CF: 400,000, 200,000, 150,000、r=10%。NPV（最も近い整数）。",
    solution: "-58378",
    explanation:
      "PV≈363,636+165,289+112,697=641,622。NPV=641,622-700,000=-58,378。",
    difficulty: "hard",
    unit: "円",
    rounding: "round",
  },
  {
    id: "q35",
    year: 2024,
    questionNumber: 8,
    category: "意思決定",
    content:
      "自製変動費1,900円/個、外注2,000円/個。回避可能固定費300,000、数量1,000。外注のほうが得か（得なら1、損なら0）。",
    solution: "1",
    explanation:
      "外注コスト2,000,000-回避固定300,000=1,700,000、自製1,900,000→外注が有利(1)。",
    difficulty: "medium",
    type: "single",
    choices: ["0", "1"],
  },
  {
    id: "q36",
    year: 2024,
    questionNumber: 9,
    category: "待ち行列",
    content:
      "M/M/1、λ=9/時、μ=10/時。平均待ち時間Wq（時間, 小数表示可）。",
    solution: "0.9",
    explanation:
      "Wq=λ/(μ(μ-λ))=9/(10×1)=0.9時間。",
    difficulty: "hard",
    unit: "時間",
  },
  {
    id: "q37",
    year: 2023,
    questionNumber: 9,
    category: "線形計画",
    content:
      "Max Z=6X+5Y, s.t. 3X+Y≤12, X+2Y≤10, X,Y≥0。最適Z（最も近い整数）。",
    solution: "35",
    explanation:
      "交点は 3X+Y=12 と X+2Y=10 → Y=3.6, X=2.8。Z=6×2.8+5×3.6=34.8 ⇒ 最も近い整数で35。",
    difficulty: "hard",
    rounding: "round",
  },
  {
    id: "q38",
    year: 2022,
    questionNumber: 9,
    category: "WACC",
    content:
      "E/D=1、Re=9%、Rd=4%、税率30%。WACC（%）。",
    solution: "6",
    explanation:
      "E=50%,D=50%。WACC=0.5×9%+0.5×4%×(1-0.3)=4.5%+1.4%=5.9%≈6%。",
    difficulty: "hard",
    unit: "%",
    rounding: "round",
  },
  {
    id: "q39",
    year: 2021,
    questionNumber: 9,
    category: "デリバティブ",
    content:
      "ブラック–ショールズ近似でガンマが0.02、原資産±5円変動時のデルタ変化の概算（絶対値）。",
    solution: "0.1",
    explanation:
      "Δの変化 ≈ Γ×ΔS = 0.02×5 = 0.1。",
    difficulty: "hard",
  },
  {
    id: "q40",
    year: 2020,
    questionNumber: 9,
    category: "キャッシュフロー",
    content:
      "EBIT 800、税率30%、減価償却200、CAPEX 300、運転資本増加100。FCF。",
    solution: "360",
    explanation:
      "FCF = EBIT(1-T)+減価償却−CAPEX−ΔWC = 800×0.7+200−300−100=360。",
    difficulty: "hard",
  },
  {
    id: "q41",
    year: 2019,
    questionNumber: 9,
    category: "感度分析",
    content:
      "P=3,000、V=2,200、F=640,000。Vが+5%上昇時の損益分岐点数量の増加幅（個、最も近い整数）。",
    solution: "128",
    explanation:
      "元寄与=800→Qb=640,000/800=800。V↑5%でV=2,310→寄与=690→Qb=640,000/690≈927.54。差≈127.54→128。",
    difficulty: "hard",
    unit: "個",
    rounding: "round",
  },
];

