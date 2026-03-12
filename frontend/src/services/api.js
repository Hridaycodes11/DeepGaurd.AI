import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
  timeout: 60000
});

export async function analyzeVideo(file) {
  const formData = new FormData();
  formData.append('video', file);
  const { data } = await api.post('/api/detect/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function analyzeWebcamFrame(imageBlob) {
  const formData = new FormData();
  formData.append('frame', imageBlob, 'webcam.jpg');
  const { data } = await api.post('/api/detect/webcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
