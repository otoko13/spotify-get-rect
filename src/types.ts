export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyAlbumArtist {
  uri: string;
  name: string;
}

export interface SpotifyTrack {
  artists: SpotifyAlbumArtist[];
  album: SpotifyAlbum;
  id: string;
  name: string;
  uri: string;
}

export interface SpotifyAlbum {
  added_at?: string;
  external_urls: { spotify: string };
  id: string;
  uri: string;
  album_type: 'single' | 'album' | 'compilation';
  images: SpotifyImage[];
  name: string;
  artists: SpotifyAlbumArtist[];
  tracks: {
    items: SpotifyTrack[];
  };
  genres: string[];
}

export interface SpotifyPlaylist {
  images: SpotifyImage[];
  name: string;
  uri: string;
  id: string;
  tracks: {
    href: string;
    total: number;
  };
  snapshot_id: string;
  owner: {
    id: string;
  };
}

export interface Album extends SpotifyAlbum {
  link_url: string;
}

export interface SpotifyChapter {
  id: string;
  name: string;
  show: {
    id: string;
    name: string;
    uri: string;
  };
  images: SpotifyImage[];
  uri: string;
}

export type SpotifyPlayerSong = {
  currently_playing_type: 'track';
  item: SpotifyTrack;
};
export type SpotifyPlayerEpisode = {
  currently_playing_type: 'episode';
  item: SpotifyChapter;
};

export type SpotifyPlayerItem = {
  device: SpotifyDevice;
  actions: {
    pausing: boolean;
  };
  is_playing: boolean;
};

export type SpotifyPlayerSongTrack = SpotifyPlayerItem & SpotifyPlayerSong;

export type SpotifyPlayerTrack = SpotifyPlayerItem &
  (SpotifyPlayerSong | SpotifyPlayerEpisode);

export interface SpotifyUser {
  images: SpotifyImage[];
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}
