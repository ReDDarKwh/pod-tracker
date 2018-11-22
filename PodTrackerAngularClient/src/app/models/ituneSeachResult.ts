export class ItuneSearchResultItem {
  artworkUrl60: string;
  artworkUrl100: string;
  feedUrl: string;
  trackName: string;
}

export class ItuneSearchResult {
  resultCount: number;
  results: ItuneSearchResultItem[];
}
