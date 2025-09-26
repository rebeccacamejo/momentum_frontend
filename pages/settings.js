import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { uploadLogo, getBrandSettings, saveBrandSettings } from '../lib/api';

export default function Settings() {
  const [primaryColor, setPrimaryColor] = useState('#2A3EB1');
  const [secondaryColor, setSecondaryColor] = useState('#4C6FE7');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    async function load() {
      try {
        const saved = await getBrandSettings();
        setPrimaryColor(saved.primary_color || '#2A3EB1');
        setSecondaryColor(saved.secondary_color || '#4C6FE7');
        if (saved.logo_url) setLogoUrl(saved.logo_url);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    await saveBrandSettings({ primary_color: primaryColor, secondary_color: secondaryColor, logo_url: logoUrl });
    alert('Brand settings saved to Momentum!');
  };

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadLogo(file);
    setLogoUrl(url);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Brand Settings</h1>
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          {/* Color pickers */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary color</label>
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary color</label>
            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium">Logo</label>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoFile} />
            {logoUrl && <img src={logoUrl} alt="Logo preview" className="h-12 mt-2" />}
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary"
            style={{ backgroundColor: primaryColor }}
          >
            Save
          </button>
        </div>
      </main>
    </>
  );
}