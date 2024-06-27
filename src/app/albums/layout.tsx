import MenuTabs from '@/_components/MenuTabs';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { redirect, usePathname } from 'next/navigation';

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
    <div className="p-4 h-full">
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

      {children}
    </div>
  );
}
