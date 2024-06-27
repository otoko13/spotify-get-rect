import CurrentlyPlaying from '@/_components/currentlyPlaying/CurrentlyPlaying';
import MenuTabs from '@/_components/menuTabs/MenuTabs';
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
  return (
    <div className="p-4">
      <MenuTabs
        tabs={[
          {
            label: 'Saved albums',
            path: '/albums/saved-albums',
          },
          {
            label: 'Recommendations',
            path: '/albums/recommendations',
          },
        ]}
      />

      <div className="mt-12">{children}</div>
      <CurrentlyPlaying />
    </div>
  );
}
