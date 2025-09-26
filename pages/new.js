import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import {
  getBrandSettings,
  generateFromTranscript,
  uploadAudio,
} from '../lib/api';

export default function New() {
  const router = useRouter();

  const [mode, setMode] = useState('text'); // 'text' | 'audio'
  const [clientName, setClientName] = useState('');
  const [transcript, setTranscript] = useState('');
  const [file, setFile] = useState(null);

  // Brand (prefilled from backend)
  const [primaryColor, setPrimaryColor] = useState('#2A3EB1');
  const [secondaryColor, setSecondaryColor] = useState('#4C6FE7');
  const [logoUrl, setLogoUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load brand settings from backend on mount
  useEffect(() => {
    async function loadBrand() {
      try {
        const saved = await getBrandSettings();
        if (saved?.primary_color) setPrimaryColor(saved.primary_color);
        if (saved?.secondary_color) setSecondaryColor(saved.secondary_color);
        if (saved?.logo_url) setLogoUrl(saved.logo_url);
      } catch (e) {
        console.warn('Failed to load brand settings; using defaults', e);
      }
    }
    loadBrand();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim()) {
      setError('Please enter a client name.');
      return;
    }

    if (mode === 'text' && !transcript.trim()) {
      setError('Please paste a transcript or notes.');
      return;
    }

    if (mode === 'audio' && !file) {
      setError('Please choose an audio file (MP3, M4A, MP4, WAV).');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (mode === 'text') {
        result = await generateFromTranscript({
          clientName,
          transcript,
          primaryColor,
          secondaryColor,
          logoUrl,
          templateType: 'action_plan',
        });
      } else {
        result = await uploadAudio({
          file,
          clientName,
          primaryColor,
          secondaryColor,
          logoUrl,
          templateType: 'action_plan',
        });
      }

      if (!result?.id) {
        throw new Error('No deliverable ID returned.');
      }
      // Go to the deliverable viewer
      router.push(`/deliverables/${result.id}`);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to generate deliverable. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">New Deliverable</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >
          {/* Mode toggle */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`px-4 py-2 rounded-lg border ${
                mode === 'text'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
              style={
                mode === 'text' ? { backgroundColor: primaryColor } : undefined
              }
            >
              Paste transcript / notes
            </button>
            <button
              type="button"
              onClick={() => setMode('audio')}
              className={`px-4 py-2 rounded-lg border ${
                mode === 'audio'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
              style={
                mode === 'audio' ? { backgroundColor: primaryColor } : undefined
              }
            >
              Upload audio
            </button>
          </div>

          {/* Client name */}
          <div>
            <label className="block text-sm font-medium mb-1">Client name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., Acme Co"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          {/* Input area */}
          {mode === 'text' ? (
            <div>
              <label className="block text-sm font-medium mb-1">
                Transcript / notes
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={10}
                placeholder="Paste your meeting transcript or bullet notes…"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Audio file
              </label>
              <input
                type="file"
                accept="audio/*,video/mp4"
                onChange={onFileChange}
                className="block"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted: MP3, M4A, WAV, MP4 (audio track)
              </p>
            </div>
          )}

          {/* Brand preview (read-only; comes from /brand/settings) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary color
              </label>
              <div className="h-10 w-16 rounded border" style={{ backgroundColor: primaryColor }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Secondary color
              </label>
              <div className="h-10 w-16 rounded border" style={{ backgroundColor: secondaryColor }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-10 object-contain" />
              ) : (
                <div className="text-xs text-gray-500">No logo set</div>
              )}
              <div className="text-xs mt-1">
                Edit in <span className="underline">Settings</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-white hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? 'Generating…' : 'Generate deliverable'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
