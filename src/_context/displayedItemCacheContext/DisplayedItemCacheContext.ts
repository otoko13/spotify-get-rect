import { SpotifyAlbum, SpotifyChapter, SpotifyPlaylist } from '@/types';
import { createContext } from 'react';

export type DisplayedItemCacheContextType = {
  savedAlbums: SpotifyAlbum[];
  mostPlayedAlbums: SpotifyAlbum[];
  recommendations: SpotifyAlbum[];
  newReleases: SpotifyAlbum[];
  playLists: SpotifyPlaylist[];
  audiobooks: SpotifyChapter[];
  onSavedAlbumsChanged: (items: SpotifyAlbum[]) => void;
  onMostPlayedAlbumsChanged: (items: SpotifyAlbum[]) => void;
  onRecommendationsChanged: (items: SpotifyAlbum[]) => void;
  onNewReleasesChanged: (items: SpotifyAlbum[]) => void;
  onPlayListsChanged: (items: SpotifyPlaylist[]) => void;
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
  savedAlbums: [],
  audiobooks: [],
  mostPlayedAlbums: [],
  newReleases: [],
  playLists: [],
  recommendations: [],
  onSavedAlbumsChanged: () => undefined,
  onMostPlayedAlbumsChanged: () => undefined,
  onRecommendationsChanged: () => undefined,
  onNewReleasesChanged: () => undefined,
  onPlayListsChanged: () => undefined,
  onAudiobooksChanged: () => undefined,
  savedAlbumsNextUrl: undefined,
  onSavedAlbumsNextUrlChanged: () => undefined,
  mostPlayedAlbumsNextUrl: undefined,
  onMostPlayedAlbumsNextUrlChanged: () => undefined,
  recommendationsNextUrl: undefined,
  onRecommendationsNextUrlChanged: () => undefined,
  newReleasesNextUrl: undefined,
  onNewReleasesNextUrlChanged: () => undefined,
  playlistsNextUrl: undefined,
  onPlaylistsNextUrlChanged: () => undefined,
  audiobooksNextUrl: undefined,
  onAudiobooksNextUrlChanged: () => undefined,
});

export default DisplayedItemCacheContext;
