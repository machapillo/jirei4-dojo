export default function ReferencePage() {
  return (
    <main className="space-y-6">
      <h2 className="text-lg font-semibold">デジタル参考書</h2>
      <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-1">
        <li>CVP分析（損益分岐点、安全余裕率 など）</li>
        <li>投資意思決定（NPV、IRR、回収期間法）</li>
        <li>原価計算（直接原価計算、全部原価計算）</li>
        <li>財務指標（ROA、ROE、回転率 など）</li>
      </ul>
      <p className="text-xs text-neutral-500">（MVP: プレースホルダー。各項目に解説と関連過去問リンクを追加予定。）</p>
    </main>
  );
}
