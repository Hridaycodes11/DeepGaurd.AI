import { useMemo, useRef, useState } from 'react';
import PredictionChart from '../components/PredictionChart';
import TrustScoreCard from '../components/TrustScoreCard';
import { analyzeVideo, analyzeWebcamFrame } from '../services/api';

export default function DashboardPage() {
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [status, setStatus] = useState('Awaiting media input...');
  const videoRef = useRef(null);

  const timeline = useMemo(() => result?.frame_predictions || [], [result]);

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setStatus('Uploading and processing video...');
    setLoading(true);
    try {
      const data = await analyzeVideo(file);
      setResult(data);
      setStatus('Processing complete.');
    } catch (error) {
      setStatus(error.response?.data?.error || 'Detection failed.');
    } finally {
      setLoading(false);
    }
  };

  const onWebcamDetect = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Webcam unsupported in this browser.');
      return;
    }

    setStatus('Capturing webcam frame...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const frame = await imageCapture.grabFrame();
    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.getContext('2d').drawImage(frame, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);
      try {
        const data = await analyzeWebcamFrame(blob);
        setResult(data);
        setStatus('Webcam inference complete.');
      } catch (error) {
        setStatus(error.response?.data?.error || 'Webcam detection failed.');
      } finally {
        setLoading(false);
        track.stop();
      }
    }, 'image/jpeg');
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white">Detection Dashboard</h2>
        <p className="mt-2 text-sm text-slate-300">Upload a video or run webcam detection for frame-level deepfake scoring.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-indigo-300/40 p-8 text-center hover:border-indigo-300">
            <span className="font-semibold text-indigo-200">Drag & Drop / Upload Video</span>
            <span className="text-xs text-slate-300">MP4, MOV supported</span>
            <input type="file" className="hidden" accept="video/*" onChange={onUpload} />
          </label>
          <button onClick={onWebcamDetect} className="rounded-xl bg-slate-800 p-8 text-left hover:bg-slate-700">
            <p className="font-semibold text-cyan-200">Start Webcam Detection</p>
            <p className="mt-2 text-xs text-slate-300">Capture current frame for real-time inference.</p>
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-400">Status: {status}</div>
        {selectedFile && <div className="mt-2 text-xs text-slate-500">Selected file: {selectedFile.name}</div>}
      </section>

      {loading && <div className="glass rounded-xl p-4 text-sm text-indigo-100">Processing media... running frame extraction and model inference.</div>}

      {result && (
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="glass rounded-2xl p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-indigo-200">Explainability</h3>
                <button onClick={() => setShowHeatmap((value) => !value)} className="rounded-lg border border-white/20 px-3 py-1 text-xs">
                  {showHeatmap ? 'Show Original' : 'Show Heatmap'}
                </button>
              </div>
              <img
                className="max-h-[420px] w-full rounded-xl object-contain"
                src={showHeatmap ? `data:image/png;base64,${result.gradcam_image}` : `data:image/png;base64,${result.original_frame}`}
                alt="Grad-CAM overlay"
              />
            </section>
            <PredictionChart data={timeline} />
          </div>
          <div className="space-y-6">
            <TrustScoreCard label={result.label} confidence={result.confidence * 100} trustScore={result.trust_score * 100} />
            <section className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-indigo-200">Results</h3>
              <p className="mt-3 text-sm text-slate-300">Frames analyzed: {result.frames_analyzed}</p>
              <a href={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/report/${result.report_id}`} target="_blank" className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">Download Report</a>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
