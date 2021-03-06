import { Component, OnInit } from '@angular/core';
import {
  ItuneSearchResultItem,
  ItuneSearchResult
} from 'src/app/models/ituneSeachResult';
import { ItuneSearchService } from 'src/app/services/itune-search.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, catchError, map } from 'rxjs/operators';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HeaderService } from 'src/app/services/header.service';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  results: ItuneSearchResultItem[];
  fieldSearch: FormControl;
  colspan = 2;
  rowspan = 1;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map(result => result.matches));

  constructor(
    private itunesSearch: ItuneSearchService,
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private router: Router
  ) {
    this.headerService.titleSubject.next('Browse');

    this.fieldSearch = new FormControl();

    this.fieldSearch.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(val => {
          return itunesSearch.search(val);
        }),
        catchError(err => throwError(err))
      )
      .subscribe((result: ItuneSearchResult) => {
        this.results = result.results;
      });
  }

  onClickPodcast(podcast: ItuneSearchResultItem) {
    this.router.navigate(['/podcast', podcast.feedUrl]);
  }

  ngOnInit() {}
}
