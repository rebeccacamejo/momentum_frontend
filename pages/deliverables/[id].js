import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { fetchDeliverable, getPdfUrl } from '../../lib/api';

export default function Deliverable() {
  const router = useRouter();
  const { id } = router.query;
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const content = await fetchDeliverable(id);
        setHtml(content);
      } catch (err) {
        console.error(err);
        setError('Unable to load deliverable');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // download pdf with html2canvas (client side pdf rendering)
  // const downloadPdf = async () => {
  //   const element = printRef.current;
  //   if (!element) return;
  //   const canvas = await html2canvas(element, { scale: 2 });
  //   const data = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const imgProps = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //   pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`deliverable-${id}.pdf`);
  // };

  //switched to server-side PDF rendering
  const handleDownloadPdf = async() => {
    try {
      setPdfLoading(true);
      const url = await getPdfUrl(id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Deliverable</h1>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary disabled:opacity-50"
          >
            {pdfLoading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          <article
            className="bg-white shadow rounded-lg p-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </main>
    </>
  );
}