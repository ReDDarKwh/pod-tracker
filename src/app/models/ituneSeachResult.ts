export class ItuneSearchResultItem {
  artworkUrl60: string;
  artworkUrl100: string;
  feedUrl: string;
  trackName: string;
  genreIds: string[];
  genres: string[];
}

export class ItuneSearchResult {
  resultCount: number;
  results: ItuneSearchResultItem[];
}
