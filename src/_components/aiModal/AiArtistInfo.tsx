'use client';

import { SpotifyPlayerSongTrack, SpotifyPlayerTrack } from '@/types';
import OpenAI from 'openai';
import { useCallback, useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

interface AiTrackImageProps {
  track: SpotifyPlayerTrack | undefined;
}

export default function AiTrackImage({ track }: AiTrackImageProps) {
  const [generateArtistInfo, setGenerateArtistInfo] = useState(false);
  const [artistResponse, setArtistResponse] = useState<string | null>();

  const fetchArtistInfo = useCallback(async () => {
    const response = await fetch(
      `/api/artist-summary?artist=${
        (track as SpotifyPlayerSongTrack)?.item.artists[0].name
      }`,
    );
    if (response.status !== 200) {
      return;
    }

    const data: OpenAI.ChatCompletion = await response.json();
    setArtistResponse(data.choices[0]?.message?.content);
  }, [track]);

  useEffect(() => {
    if (generateArtistInfo && track?.currently_playing_type === 'track') {
      fetchArtistInfo();
    }
  }, [generateArtistInfo, track, fetchArtistInfo]);

  return (
    <div className="artist-info-section flex-grow border-slate-700 border-t w-full flex flex-col items-center justify-center p-4">
      {!generateArtistInfo ? (
        <button
          className="btn btn-outline btn-lg btn-primary"
          onClick={() => setGenerateArtistInfo(true)}
        >
          Tell me more about this artist
        </button>
      ) : artistResponse ? (
        <div className="text-center max-md:w-full w-8/12">
          <Typewriter
            options={{
              delay: 30,
            }}
            onInit={(typewriter) => {
              typewriter.pauseFor(2500).typeString(artistResponse).start();
            }}
          />
        </div>
      ) : (
        <div className="loading loading-bars loading-lg text-primary" />
      )}
    </div>
  );
}
