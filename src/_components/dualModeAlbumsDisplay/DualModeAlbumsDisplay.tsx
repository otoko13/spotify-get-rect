'use client';

import { useState } from 'react';
import Toggle from '../toggle/Toggle';
import BabylonAlbumsDisplay from '../babylonAlbumsDisplay/BabylonAlbumsDisplay';
import AlbumsDisplay from '../albumsDisplay/AlbumsDisplay';
import AlbumsLoading from '../albumsLoading/AlbumsLoading';
import { SpotifyAlbum } from '@/types';

interface DualModeAlbumsDisplayProps {
  albums: SpotifyAlbum[];
  fetchMoreForCanvas: () => void;
  loading: boolean;
}

export default function DualModeAlbumsDisplay({
  albums,
  fetchMoreForCanvas,
  loading,
}: DualModeAlbumsDisplayProps) {
  const [use3D, setUse3D] = useState(false);
  return (
    <div>
      <Toggle
        label="Go 3D!"
        on={use3D}
        onChange={setUse3D}
        className="fixed top-4 right-16"
      />
      {use3D ? (
        <BabylonAlbumsDisplay
          albums={albums}
          loading={loading}
          onLoadMoreButtonClicked={fetchMoreForCanvas}
        />
      ) : (
        <AlbumsDisplay albums={albums} />
      )}
      {loading && !use3D && <AlbumsLoading />}
    </div>
  );
}
