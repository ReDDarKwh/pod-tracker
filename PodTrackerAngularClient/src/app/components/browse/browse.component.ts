import { Component, OnInit } from '@angular/core';
import {
  ItuneSearchResultItem,
  ItuneSearchResult
} from 'src/app/models/ituneSeachResult';
import { ItuneSearchService } from 'src/app/services/itune-search.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HeaderService } from 'src/app/services/header.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

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

  constructor(
    private itunesSearch: ItuneSearchService,
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private router: Router
  ) {
    this.headerService.titleSubject.next('Browse');

    this.fieldSearch = new FormControl();

    this.breakpointObserver
      .observe(Breakpoints.Small)
      .subscribe(({ matches }) => {
        this.colspan = matches ? 2 : 1;
      });

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
