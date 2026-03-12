# DeepGuard AI – Real-Time Deepfake Detection Web Suite

Modern full-stack application for deepfake detection with an AI SaaS-style dashboard.

## Stack
- **Frontend:** React + Tailwind CSS + Framer Motion + Recharts
- **Backend:** Flask API + OpenCV + NumPy (model inference scaffold ready for TensorFlow/PyTorch)
- **Explainability:** Grad-CAM-style heatmap overlay generation

## Project Structure

- `frontend/` React dashboard and landing page
- `backend/` Flask inference API and report generation

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

## API Endpoints

- `GET /api/health`
- `POST /api/detect/upload` – upload video
- `POST /api/detect/webcam` – upload webcam frame
- `GET /api/report/<report_id>` – download JSON report

## Notes for production

- Replace the mock `DeepfakeDetector` scoring function with a trained TensorFlow/PyTorch checkpoint.
- Add async job queue + websocket updates for long videos.
- Persist reports and uploads using cloud object storage.
