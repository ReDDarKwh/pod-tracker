import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItuneSearchResult } from '../models/ituneSeachResult';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FollowedPodcast } from '../models/podcast';

@Injectable({
  providedIn: 'root'
})
export class ItuneSearchService {
  constructor(private httpClient: HttpClient) {}

  search(term: string): Observable<ItuneSearchResult> {
    const apiURL = `https://itunes.apple.com/search?term=${term}&media=podcast&limit=20`;

    return this.httpClient.jsonp<ItuneSearchResult>(apiURL, 'callback');
  }

  topPodcasts(category: string): Observable<any> {
    const apiURL = `https://itunes.apple.com/us/rss/topaudiopodcasts/genre=${category}/json`;

    return this.httpClient.jsonp<any>(apiURL, 'callback');
  }

  podcastById(id: string): Observable<FollowedPodcast> {
    const apiURL = `https://itunes.apple.com/lookup?id=${id}`;

    return this.httpClient.jsonp<FollowedPodcast>(apiURL, 'callback');
  }
}
