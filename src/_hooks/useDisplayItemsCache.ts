import { SpotifyAlbum, SpotifyChapter, SpotifyPlaylist } from '@/types';
import { useState } from 'react';

const useDisplayItemsCache = () => {
  const [savedAlbums, setSavedAlbums] = useState<SpotifyAlbum[]>([]);
  const [mostPlayedAlbums, setMostPlayedAlbums] = useState<SpotifyAlbum[]>([]);
  const [recommendations, setRecommendations] = useState<SpotifyAlbum[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
  const [playLists, setPlayLists] = useState<SpotifyPlaylist[]>([]);
  const [audiobooks, setAudiobooks] = useState<SpotifyChapter[]>([]);

  const [savedAlbumsUrl, setSavedAlbumsUrl] = useState<string | null>();
  const [mostPlayedAlbumsUrl, setMostPlayedAlbumsUrl] = useState<
    string | null
  >();
  const [recommendationsUrl, setRecommendationsUrl] = useState<string | null>();
  const [newReleasesUrl, setNewReleasesUrl] = useState<string | null>();
  const [playListsUrl, setPlayListsUrl] = useState<string | null>();
  const [audiobooksUrl, setAudiobooksUrl] = useState<string | null>();

  return {
    savedAlbums,
    setSavedAlbums,
    mostPlayedAlbums,
    setMostPlayedAlbums,
    recommendations,
    setRecommendations,
    audiobooks,
    setAudiobooks,
    newReleases,
    setNewReleases,
    playLists,
    setPlayLists,
    savedAlbumsUrl,
    setSavedAlbumsUrl,
    mostPlayedAlbumsUrl,
    setMostPlayedAlbumsUrl,
    recommendationsUrl,
    setRecommendationsUrl,
    newReleasesUrl,
    setNewReleasesUrl,
    playListsUrl,
    setPlayListsUrl,
    audiobooksUrl,
    setAudiobooksUrl,
  };
};

export default useDisplayItemsCache;
