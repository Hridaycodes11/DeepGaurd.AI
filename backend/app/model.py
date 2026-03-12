from __future__ import annotations

import base64
import io
from dataclasses import dataclass

import cv2
import numpy as np
from PIL import Image


@dataclass
class PredictionResult:
    label: str
    confidence: float
    trust_score: float
    frame_predictions: list[dict]
    gradcam_image: str
    original_frame: str


class DeepfakeDetector:
    """Lightweight inference stub that can be swapped with a trained TensorFlow/PyTorch model."""

    def __init__(self) -> None:
        self.threshold = 0.5

    def _encode_image(self, frame: np.ndarray) -> str:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(rgb)
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

    def _mock_gradcam(self, frame: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        heatmap = cv2.applyColorMap(cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX), cv2.COLORMAP_JET)
        return cv2.addWeighted(frame, 0.45, heatmap, 0.55, 0)

    def _frame_probability(self, frame: np.ndarray) -> float:
        laplacian_var = cv2.Laplacian(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var()
        normalized = 1 / (1 + np.exp(-(laplacian_var - 80) / 40))
        return float(np.clip(normalized, 0.01, 0.99))

    def predict_video(self, video_path: str, max_frames: int = 24) -> PredictionResult:
        capture = cv2.VideoCapture(video_path)
        predictions = []
        representative = None

        idx = 0
        while capture.isOpened() and idx < max_frames:
            success, frame = capture.read()
            if not success:
                break
            if idx % 2 == 0:
                probability = self._frame_probability(frame)
                predictions.append({'frame': len(predictions), 'fakeProbability': probability})
                representative = frame
            idx += 1

        capture.release()

        if not predictions or representative is None:
            raise ValueError('No valid frames extracted from video.')

        fake_mean = float(np.mean([item['fakeProbability'] for item in predictions]))
        trust_score = 1.0 - fake_mean
        label = 'Fake' if fake_mean >= self.threshold else 'Real'

        gradcam = self._mock_gradcam(representative)
        return PredictionResult(
            label=label,
            confidence=max(fake_mean, trust_score),
            trust_score=trust_score,
            frame_predictions=predictions,
            gradcam_image=self._encode_image(gradcam),
            original_frame=self._encode_image(representative)
        )

    def predict_frame(self, frame_bytes: bytes) -> PredictionResult:
        np_buffer = np.frombuffer(frame_bytes, dtype=np.uint8)
        frame = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError('Invalid frame input.')

        fake_probability = self._frame_probability(frame)
        trust_score = 1.0 - fake_probability
        label = 'Fake' if fake_probability >= self.threshold else 'Real'
        gradcam = self._mock_gradcam(frame)

        return PredictionResult(
            label=label,
            confidence=max(fake_probability, trust_score),
            trust_score=trust_score,
            frame_predictions=[{'frame': 0, 'fakeProbability': fake_probability}],
            gradcam_image=self._encode_image(gradcam),
            original_frame=self._encode_image(frame)
        )
