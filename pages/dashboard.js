import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { fetchDeliverables } from '../lib/api';

export default function Dashboard() {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDeliverables();
        setDeliverables(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-4 text-primary">Your Deliverables</h1>
        {loading ? (
          <p>Loading...</p>
        ) : deliverables.length === 0 ? (
          <p>No deliverables yet. <Link href="/new" className="text-primary underline">Create one now.</Link></p>
        ) : (
          <ul className="space-y-4">
            {deliverables.map((d) => (
              <li key={d.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">{d.client_name}</h2>
                  <p className="text-sm text-gray-500">Generated on {new Date(d.created_at).toLocaleString()}</p>
                </div>
                <div className="space-x-2">
                  <Link href={`/deliverables/${d.id}`} className="text-primary underline">View</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}