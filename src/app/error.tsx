'use client';

import Link from 'next/link';

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center">
      <div className="text-8xl mb-4">Uh-oh!</div>
      <div className="text-lg mb-12 text-gray-600">
        Sorry, it looks like something went wrong. We&apos;ll fix it as soon as
        we can!
      </div>
      <div className="text-sm text-gray-700">{error.message}</div>
      <div className="mt-8">
        <Link href="/" className="text-green-500">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
