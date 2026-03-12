export default function TrustScoreCard({ label, confidence, trustScore }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-indigo-200">Detection Summary</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-300">Label</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${label === 'Real' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
          {label}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>Trust Score</span>
          <span>{trustScore.toFixed(1)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-800">
          <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${trustScore}%` }} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-300">Confidence: <span className="font-semibold text-slate-100">{confidence.toFixed(1)}%</span></p>
    </section>
  );
}
