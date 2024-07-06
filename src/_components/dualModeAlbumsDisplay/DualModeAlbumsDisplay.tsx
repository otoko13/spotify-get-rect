'use client';

import { useCallback, useState } from 'react';
import Toggle from '../toggle/Toggle';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import { SpotifyAlbum } from '@/types';
import { useCookies } from 'next-client-cookies';

interface DualModeAlbumsDisplayProps {
  albums: SpotifyAlbum[];
  fetchMoreForCanvas: () => void;
  loading: boolean;
  noMoreAlbums?: boolean;
}

export default function DualModeAlbumsDisplay({
  albums,
  fetchMoreForCanvas,
  loading,
  noMoreAlbums,
}: DualModeAlbumsDisplayProps) {
  const cookies = useCookies();
  const [use3D, setUse3D] = useState(Boolean(cookies.get('use-3d')));

  const handleToggle = useCallback(
    (val: boolean) => {
      setUse3D(val);
      if (val) {
        cookies.set('use-3d', 'true');
      } else {
        cookies.remove('use-3d');
      }
    },
    [cookies],
  );

  return (
    <div>
      <Toggle
        label="Go 3D!"
        on={use3D}
        onChange={handleToggle}
        className="fixed top-6 right-16"
      />
      {use3D ? (
        <BabylonAlbumsDisplay
          albums={albums}
          loading={loading}
          noMoreAlbums={!!noMoreAlbums}
          onLoadMoreButtonClicked={fetchMoreForCanvas}
        />
      ) : (
        <AlbumsDisplay albums={albums} loading={loading} />
      )}
      {loading && !use3D && <AlbumsLoading />}
    </div>
  );
}
