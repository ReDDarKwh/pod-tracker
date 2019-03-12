import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { RssParserService } from 'src/app/services/rss-parser.service';
import { HeaderService } from 'src/app/services/header.service';
import { Podcast, FollowedPodcast } from 'src/app/models/podcast';
import { AuthenticationService } from 'src/app/services/auth.service';
import { AjaxCommService } from 'src/app/services/ajax-comm.service';
import { PodcastEpisode } from 'src/app/models/podcastEpisode';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.css']
})
export class PodcastComponent implements OnInit {
  podcast: Podcast;

  orderByDesc: BehaviorSubject<boolean>;

  podcastEpisodes: Observable<PodcastEpisode[]>;

  constructor(
    private route: ActivatedRoute,
    private rssParser: RssParserService,
    private headerService: HeaderService,
    private authService: AuthenticationService,
    private ajaxComm: AjaxCommService
  ) {
    this.orderByDesc = new BehaviorSubject<boolean>(true);

    this.podcastEpisodes = this.orderByDesc.asObservable().pipe(
      map(x => {
        if (!this.podcast) {
          return [];
        }
        const pod = x
          ? this.podcast.podcastEpisode
          : this.podcast.podcastEpisode.slice().reverse();

        return pod;
      })
    );

    route.params.subscribe(params => {
      if (params.rss) {
        const observable = this.rssParser.getFeedContent(params.rss);

        observable.subscribe((data: Podcast) => {
          headerService.titleSubject.next('');
          this.podcast = data;
        });
      }
    });
  }

  toggleFollowPodcast() {
    // followed podcast have an ID.
    const requestPod: FollowedPodcast = (({
      userId,
      title,
      imageUrl,
      rss,
      followed,
      id,
      lastListened
    }) => ({
      userId: this.authService.currentUserValue.id,
      title,
      imageUrl,
      rss,
      followed,
      id,
      lastListened
    }))(this.podcast);

    requestPod.followed = !requestPod.followed;

    this.ajaxComm
      .put({
        control: 'FollowedPodcasts',
        params: { rss: requestPod.rss },
        data: requestPod
      })
      .subscribe(() => {
        this.podcast.followed = requestPod.followed;
      });
  }

  ngOnInit() {}

  changePodcastOrder() {
    this.orderByDesc.next(!this.orderByDesc.value);
  }
}
