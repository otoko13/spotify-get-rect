'use client';

import { useCallback, useEffect, useState } from 'react';
import ArtStyleOptions, { ArtStyle } from './ArtStyleOptions';
import { SpotifyPlayerSongTrack, SpotifyPlayerTrack } from '@/types';
import Image from 'next/image';

interface AiTrackImageProps {
  track: SpotifyPlayerTrack | undefined;
}

export default function AiTrackImage({ track }: AiTrackImageProps) {
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>();
  const [imageUrl, setImageUrl] = useState<string>();

  const fetchTrackImage = useCallback(async () => {
    const response = await fetch(
      `/api/track-image?style=${selectedStyle}&artist=${
        (track as SpotifyPlayerSongTrack)?.item.artists[0].name
      }&song=${(track as SpotifyPlayerSongTrack)?.item.name}`,
    );
    if (response.status !== 200) {
      return;
    }

    const data = await response.json();
    setImageUrl(data.url);
  }, [selectedStyle, track]);

  useEffect(() => {
    if (selectedStyle && track?.currently_playing_type === 'track') {
      fetchTrackImage();
    }
  }, [selectedStyle, fetchTrackImage, track?.currently_playing_type]);

  return (
    <div
      className="track-image-section w-full h-3/4 flex-none flex flex-col items-center justify-center py-4"
      style={{ minHeight: 512 }}
    >
      {!selectedStyle ? (
        <ArtStyleOptions onStyleSelected={setSelectedStyle} />
      ) : imageUrl ? (
        <Image
          className="animate-fade-in"
          src={imageUrl}
          alt="ai generate track image"
          width={0}
          height={0}
          style={{
            height: '100%',
            width: 'auto',
          }}
        />
      ) : (
        <div className="loading loading-bars loading-lg text-primary" />
      )}
    </div>
  );
}
