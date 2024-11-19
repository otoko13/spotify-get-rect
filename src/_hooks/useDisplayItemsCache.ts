import { SpotifyAlbum, SpotifyChapter, SpotifyPlaylist } from '@/types';
import { useState } from 'react';

const useDisplayItemsCache = () => {
  const [savedAlbums, setSavedAlbums] = useState<SpotifyAlbum[]>([]);
  const [mostPlayedAlbums, setMostPlayedAlbums] = useState<SpotifyAlbum[]>([]);
  const [recommendations, setRecommendations] = useState<SpotifyAlbum[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audiobooks, setAudiobooks] = useState<SpotifyChapter[]>([]);

  const [savedAlbumsUrl, setSavedAlbumsUrl] = useState<string | null>();
  const [mostPlayedAlbumsUrl, setMostPlayedAlbumsUrl] = useState<
    string | null
  >();
  const [recommendationsUrl, setRecommendationsUrl] = useState<string | null>();
  const [newReleasesUrl, setNewReleasesUrl] = useState<string | null>();
  const [playlistsUrl, setPlaylistsUrl] = useState<string | null>();
  const [audiobooksUrl, setAudiobooksUrl] = useState<string | null>();

  return {
    audiobooks,
    audiobooksUrl,
    mostPlayedAlbums,
    mostPlayedAlbumsUrl,
    newReleases,
    newReleasesUrl,
    playlists,
    playlistsUrl,
    recommendations,
    recommendationsUrl,
    savedAlbums,
    savedAlbumsUrl,
    setAudiobooks,
    setAudiobooksUrl,
    setMostPlayedAlbums,
    setMostPlayedAlbumsUrl,
    setNewReleases,
    setNewReleasesUrl,
    setPlaylists,
    setPlaylistsUrl,
    setRecommendations,
    setRecommendationsUrl,
    setSavedAlbums,
    setSavedAlbumsUrl,
  };
};

export default useDisplayItemsCache;
