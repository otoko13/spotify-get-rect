import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center text-center"
      style={{ background: 'inherit' }}
    >
      <div className="text-8xl mb-4">Uh-oh!</div>
      <div className="text-lg mb-12 text-gray-600">
        That page doesn&apos;t exist.
      </div>
      <div className="mt-8">
        <Link href="/" className="text-green-500">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
