import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Momentum – Turn sessions into polished deliverables</title>
      </Head>
      <Navbar />
      <main className="max-w-3xl mx-auto py-10 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Momentum</h1>
        <p className="text-lg mb-6">
          Momentum helps coaches and consultants transform raw meeting notes and recordings into
          beautifully branded client deliverables in seconds.
        </p>
        <Link href="/new" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-md font-medium">
          Create Your First Deliverable
        </Link>
      </main>
    </>
  );
}