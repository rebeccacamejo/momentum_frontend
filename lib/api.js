import axios from 'axios';

// Base URL of the backend API. You can override this by setting
// NEXT_PUBLIC_BACKEND_URL in your environment when running locally or
// deploying to a service like Vercel.
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function fetchDeliverables() {
  const res = await axios.get(`${BASE_URL}/deliverables`);
  return res.data;
}

export async function fetchDeliverable(id) {
  const res = await axios.get(`${BASE_URL}/deliverables/${id}`);
  return res.data;
}

export async function generateFromTranscript({ transcript, clientName, primaryColor, secondaryColor, logoUrl }) {
  const res = await axios.post(`${BASE_URL}/generate`, {
    transcript,
    client_name: clientName,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    logo_url: logoUrl,
  });
  return res.data;
}

export async function uploadAudio({ file, clientName, primaryColor, secondaryColor, logoUrl }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_name', clientName);
  formData.append('primary_color', primaryColor);
  formData.append('secondary_color', secondaryColor);
  if (logoUrl) formData.append('logo_url', logoUrl);
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function getPdfUrl(id) {
  const res = await axios.get(`${BASE_URL}/deliverables/${id}/pdf`);
  return res.data.url; // signed URL
}

export async function uploadLogo(file) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const form = new FormData();
  form.append('file', file);
  const res = await axios.post(`${BASE_URL}/brand/logo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url; // the logo URL to store/use
}

export async function getBrandSettings() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const res = await axios.get(`${BASE_URL}/brand/settings`);
  return res.data;
}

export async function saveBrandSettings(settings) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const res = await axios.put(`${BASE_URL}/brand/settings`, settings);
  return res.data.settings;
}

