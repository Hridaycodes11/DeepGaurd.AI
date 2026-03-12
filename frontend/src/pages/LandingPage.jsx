import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';

const features = [
  { title: 'Real-Time Detection', description: 'Stream webcam frames or upload videos for instant deepfake risk analysis.' },
  { title: 'Trust Score Intelligence', description: 'Aggregate frame-level predictions into an intuitive trust score with confidence.' },
  { title: 'Grad-CAM Explainability', description: 'Visualize manipulated regions with heatmap overlays to build decision transparency.' }
];

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="glass relative overflow-hidden rounded-3xl p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <p className="mb-3 inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">AI Security Suite</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">DeepGuard AI – Real-Time Deepfake Detection Web Suite</h1>
          <p className="mt-4 max-w-2xl text-slate-300">Protect media workflows with real-time deepfake detection, confidence analytics, and visual explainability built for trust-critical teams.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard" className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 font-semibold text-white">Upload Video</Link>
            <Link to="/dashboard" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-slate-100">Start Webcam Detection</Link>
          </div>
        </motion.div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl" />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>
    </div>
  );
}
