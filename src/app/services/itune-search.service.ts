import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItuneSearchResult } from '../models/ituneSeachResult';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItuneSearchService {
  constructor(private httpClient: HttpClient) {}

  search(term: string): Observable<ItuneSearchResult> {
    const apiURL = `https://itunes.apple.com/search?term=${term}&media=podcast&limit=20`;

    return this.httpClient.jsonp<ItuneSearchResult>(apiURL, 'callback');
  }
}
