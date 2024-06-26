export interface SpotifyAlbumImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyAlbumArtist {
  uri: string;
  name: string;
}

export interface SpotifyTrack {
  uri: string;
}

export interface SpotifyAlbum {
  external_urls: { spotify: string };
  id: string;
  uri: string;
  album_type: 'single' | 'album' | 'compilation';
  images: SpotifyAlbumImage[];
  name: string;
  artists: SpotifyAlbumArtist[];
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface Album extends SpotifyAlbum {
  link_url: string;
}
