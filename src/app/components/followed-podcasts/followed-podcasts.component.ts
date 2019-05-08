import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { AjaxCommService } from 'src/app/services/ajax-comm.service';
import { Podcast } from 'src/app/models/podcast';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-followed-podcasts',
  templateUrl: './followed-podcasts.component.html',
  styleUrls: ['./followed-podcasts.component.css']
})
export class FollowedPodcastsComponent implements OnInit {
  podcasts: Podcast[];
  colspan = 2;
  rowspan = 1;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map(result => result.matches));

  constructor(
    private headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private ajaxComm: AjaxCommService,
    private router: Router
  ) {
    this.headerService.titleSubject.next('Followed');

    this.ajaxComm
      .getAction({ control: 'followedPodcasts', action: 'favorite' })
      .subscribe(data => {
        this.podcasts = data;
      });

    // this.breakpointObserver
    //   .observe(Breakpoints.Small)
    //   .subscribe(({ matches }) => {
    //     this.colspan = matches ? 2 : 1;
    //   });
  }

  ngOnInit() {}

  onClickPodcast(podcast: Podcast) {
    this.router.navigate(['/podcast', podcast.rss, podcast.category]);
  }
}
