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

export interface Album extends SpotifyAlbum {
  link_url: string;
}

export interface SpotifyPlayerTrack {
  actions: {
    pausing: boolean;
  };
  is_playing: true;
  item: SpotifyTrack;
}

export interface SpotifyUser {
  images: SpotifyImage[];
}
