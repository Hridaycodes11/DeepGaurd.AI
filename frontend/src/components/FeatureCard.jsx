import { motion } from 'framer-motion';

export default function FeatureCard({ title, description }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass rounded-2xl p-6 shadow-glow"
    >
      <h3 className="mb-2 text-lg font-semibold text-indigo-200">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </motion.article>
  );
}
