export interface MovieGenre {
  id: number;
  name: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface WatchProvidersByCountry {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  year?: number | string;
  vote_average: number;
  vote_count?: number;
  overview: string;
  genres: MovieGenre[] | string[];
  runtime?: number | null;
  tagline?: string | null;
  status?: string;
  aiReason?: string;
  matchScore?: number;
  trailerKey?: string | null;
  ottProviders?: WatchProvider[];
  watchProviders?: {
    IN?: WatchProvidersByCountry;
    US?: WatchProvidersByCountry;
    [country: string]: WatchProvidersByCountry | undefined;
  };
  watchLink?: string | null;
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids?: number[];
  genres?: MovieGenre[];
  runtime?: number | null;
  tagline?: string | null;
  "watch/providers"?: {
    results?: Record<string, WatchProvidersByCountry>;
  };
}
