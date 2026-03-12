import { Link, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold text-indigo-300">DeepGuard AI</Link>
          <div className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-200 hover:text-white">Home</Link>
            <Link to="/dashboard" className="rounded-full bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">Detection Dashboard</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
