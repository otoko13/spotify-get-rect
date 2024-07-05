'use client';

import { SpotifyAlbum } from '@/types';
import Album from '../album/Album';

interface AlbumsDisplayProps {
  albums: SpotifyAlbum[];
}

export default function AlbumsDisplay({ albums }: AlbumsDisplayProps) {
  return (
    <div className="grid max-md:grid-cols-2 grid-cols-6 max-md:gap-4 gap-10 max-md:mb-4 mb-10 p-4">
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
    </div>
  );
}
