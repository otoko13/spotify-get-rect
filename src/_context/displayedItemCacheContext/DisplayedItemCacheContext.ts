import { SpotifyAlbum, SpotifyChapter, SpotifyPlaylist } from '@/types';
import { createContext } from 'react';

export type DisplayedItemCacheContextType = {
  savedAlbums: SpotifyAlbum[];
  mostPlayedAlbums: SpotifyAlbum[];
  recommendations: SpotifyAlbum[];
  newReleases: SpotifyAlbum[];
  playlists: SpotifyPlaylist[];
  audiobooks: SpotifyChapter[];
  onSavedAlbumsChanged: (items: SpotifyAlbum[]) => void;
  onMostPlayedAlbumsChanged: (items: SpotifyAlbum[]) => void;
  onRecommendationsChanged: (items: SpotifyAlbum[]) => void;
  onNewReleasesChanged: (items: SpotifyAlbum[]) => void;
  onPlaylistsChanged: (items: SpotifyPlaylist[]) => void;
  onAudiobooksChanged: (items: SpotifyChapter[]) => void;
  savedAlbumsNextUrl?: string | null;
  onSavedAlbumsNextUrlChanged: (url?: string | null) => void;
  mostPlayedAlbumsNextUrl?: string | null;
  onMostPlayedAlbumsNextUrlChanged: (url?: string | null) => void;
  recommendationsNextUrl?: string | null;
  onRecommendationsNextUrlChanged: (url?: string | null) => void;
  newReleasesNextUrl?: string | null;
  onNewReleasesNextUrlChanged: (url?: string | null) => void;
  playlistsNextUrl?: string | null;
  onPlaylistsNextUrlChanged: (url?: string | null) => void;
  audiobooksNextUrl?: string | null;
  onAudiobooksNextUrlChanged: (url?: string | null) => void;
};

const DisplayedItemCacheContext = createContext<DisplayedItemCacheContextType>({
  audiobooks: [],
  audiobooksNextUrl: undefined,
  mostPlayedAlbums: [],
  mostPlayedAlbumsNextUrl: undefined,
  newReleases: [],
  newReleasesNextUrl: undefined,
  onAudiobooksChanged: () => undefined,
  onAudiobooksNextUrlChanged: () => undefined,
  onMostPlayedAlbumsChanged: () => undefined,
  onMostPlayedAlbumsNextUrlChanged: () => undefined,
  onNewReleasesChanged: () => undefined,
  onNewReleasesNextUrlChanged: () => undefined,
  onPlaylistsChanged: () => undefined,
  onPlaylistsNextUrlChanged: () => undefined,
  onRecommendationsChanged: () => undefined,
  onRecommendationsNextUrlChanged: () => undefined,
  onSavedAlbumsChanged: () => undefined,
  onSavedAlbumsNextUrlChanged: () => undefined,
  playlists: [],
  playlistsNextUrl: undefined,
  recommendations: [],
  recommendationsNextUrl: undefined,
  savedAlbums: [],
  savedAlbumsNextUrl: undefined,
});

export default DisplayedItemCacheContext;
