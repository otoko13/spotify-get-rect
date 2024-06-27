import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spotify Get Rect',
  description: 'Your albums',
};

export default async function AlbumsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // put menu here
  return <div>{children}</div>;
}
