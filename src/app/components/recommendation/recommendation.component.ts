import {
  ItuneSearchResult,
  ItuneSearchResultItem
} from './../../models/ituneSeachResult';
import { Podcast, FollowedPodcast } from './../../models/podcast';
import { HeaderService } from './../../services/header.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AjaxCommService } from '../../services/ajax-comm.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ItuneSearchService } from 'src/app/services/itune-search.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  colspan = 2;
  rowspan = 1;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map(result => result.matches));
  podcasts: ItuneSearchResult[][];
  podcastsByCategory: {};

  constructor(
    private headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private ajaxComm: AjaxCommService,
    private router: Router,
    private itunesSearch: ItuneSearchService
  ) {
    this.headerService.titleSubject.next('Recommendations');

    this.ajaxComm
      .getAction({ control: 'followedPodcasts', action: 'favorite' })
      .pipe(
        map((x: FollowedPodcast[]) => {
          return x.reduce((a, b) => {
            a[b.category] = a[b.category] || [];
            a[b.category].push(b);
            return a;
          }, {});
        }),
        switchMap((x: {}) => {
          return forkJoin(
            Object.keys(x)
              .sort((a, b) => {
                return x[a].length - x[b].length;
              })
              .map(c => this.itunesSearch.topPodcasts(c))
          );
        }),
        switchMap((topPodcastsByCategoryResult: []) => {
          return forkJoin(
            topPodcastsByCategoryResult.map((x: any) =>
              forkJoin(
                x['feed']['entry'].map(e =>
                  this.itunesSearch.podcastById(e['id']['attributes']['im:id'])
                )
              )
            )
          );
        })
      )
      .subscribe((data: ItuneSearchResult[][]) => {
        this.podcasts = data;
      });
  }

  ngOnInit() {}

  onClickPodcast(podcast: ItuneSearchResultItem) {
    this.router.navigate(['/podcast', podcast.feedUrl, podcast.genreIds[0]]);
  }
}
