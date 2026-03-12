from __future__ import annotations

import json
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, jsonify, request, send_file

from .model import DeepfakeDetector

api = Blueprint('api', __name__)

detector = DeepfakeDetector()
BASE_DIR = Path(__file__).resolve().parents[1]
REPORTS_DIR = BASE_DIR / 'reports'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


@api.get('/api/health')
def health() -> tuple:
    return jsonify({'status': 'ok', 'service': 'DeepGuard AI API'})


@api.post('/api/detect/upload')
def detect_upload() -> tuple:
    video = request.files.get('video')
    if not video:
        return jsonify({'error': 'No video file provided.'}), 400

    temp_path = REPORTS_DIR / f"{uuid4()}.mp4"
    video.save(temp_path)

    try:
        result = detector.predict_video(str(temp_path))
        report_id = _store_report(result)
        payload = _serialize(result, report_id)
        return jsonify(payload)
    except Exception as exc:  # noqa: BLE001
        return jsonify({'error': str(exc)}), 500
    finally:
        temp_path.unlink(missing_ok=True)


@api.post('/api/detect/webcam')
def detect_webcam() -> tuple:
    frame = request.files.get('frame')
    if not frame:
        return jsonify({'error': 'No webcam frame provided.'}), 400

    try:
        result = detector.predict_frame(frame.read())
        report_id = _store_report(result)
        payload = _serialize(result, report_id)
        return jsonify(payload)
    except Exception as exc:  # noqa: BLE001
        return jsonify({'error': str(exc)}), 500


@api.get('/api/report/<report_id>')
def download_report(report_id: str):
    report_file = REPORTS_DIR / f'{report_id}.json'
    if not report_file.exists():
        return jsonify({'error': 'Report not found.'}), 404
    return send_file(report_file, as_attachment=True, download_name=f'deepguard-report-{report_id}.json')


def _serialize(result, report_id: str) -> dict:
    return {
        'label': result.label,
        'confidence': result.confidence,
        'trust_score': result.trust_score,
        'frame_predictions': result.frame_predictions,
        'frames_analyzed': len(result.frame_predictions),
        'gradcam_image': result.gradcam_image,
        'original_frame': result.original_frame,
        'report_id': report_id
    }


def _store_report(result) -> str:
    report_id = str(uuid4())
    report_payload = {
        'label': result.label,
        'confidence': result.confidence,
        'trust_score': result.trust_score,
        'frame_predictions': result.frame_predictions
    }
    report_file = REPORTS_DIR / f'{report_id}.json'
    report_file.write_text(json.dumps(report_payload, indent=2), encoding='utf-8')
    return report_id
