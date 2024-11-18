'use client';

import OpenAI from 'openai';
import { useCallback, useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

interface AiTrackImageProps {
  artist?: string;
  isTrack?: boolean;
}

export default function AiTrackImage({ artist, isTrack }: AiTrackImageProps) {
  const [generateArtistInfo, setGenerateArtistInfo] = useState(false);
  const [artistResponse, setArtistResponse] = useState<string | null>();

  const fetchArtistInfo = useCallback(async () => {
    const response = await fetch(`/api/artist-summary?artist=${artist}`);
    if (response.status !== 200) {
      return;
    }

    const data: OpenAI.ChatCompletion = await response.json();
    setArtistResponse(data.choices[0]?.message?.content);
  }, [artist]);

  useEffect(() => {
    if (isTrack && generateArtistInfo && artist && !artistResponse) {
      fetchArtistInfo();
    }
  }, [artist, artistResponse, fetchArtistInfo, generateArtistInfo, isTrack]);

  useEffect(() => {
    if (artist) {
      setGenerateArtistInfo(false);
      setArtistResponse(null);
    }
  }, [artist]);

  return (
    <div className="artist-info-section max-lg:flex-grow max-lg:w-full w-1/2 flex flex-col items-center justify-center p-4 max-lg:pb-32">
      {!generateArtistInfo ? (
        <button
          className="btn btn-outline btn-lg btn-primary"
          onClick={() => setGenerateArtistInfo(true)}
        >
          Tell me more about this artist
        </button>
      ) : artistResponse ? (
        <div className="text-center max-lg:w-full max-md:w-10/12 w-8/12">
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
