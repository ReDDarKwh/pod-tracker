import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HeaderService } from 'src/app/services/header.service';
import { Podcast } from 'src/app/models/podcast';
import { AjaxCommService } from 'src/app/services/ajax-comm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  podcasts: Podcast[];
  colspan = 2;
  rowspan = 1;

  constructor(
    private headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private ajaxComm: AjaxCommService,
    private router: Router
  ) {
    this.headerService.titleSubject.next('Dashboard');

    this.ajaxComm
      .getAction({ control: 'followedPodcasts', action: 'recentlyPlayed' })
      .subscribe(data => {
        this.podcasts = data;
      });
  }

  onClickPodcast(podcast: Podcast) {
    this.router.navigate(['/podcast', podcast.rss]);
  }
}
