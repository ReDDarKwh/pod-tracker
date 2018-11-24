import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AjaxCommService } from './ajax-comm.service';
import { Podcast, FollowedPodcast } from '../models/podcast';
import { PodcastEpisode } from '../models/podcastEpisode';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RssParserService {
  constructor(
    private ajaxComm: AjaxCommService,
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {}

  getFeedContent(url: string): Observable<any> {
    return forkJoin([
      this.ajaxComm.get({ control: 'XmlParser', params: { url } }).pipe(
        map(data => {
          return this.extractFeeds(data, url);
        })
      ),
      this.ajaxComm
        .get({ control: 'followedPodcasts', params: { rss: url } })
        .pipe(
          catchError(err => {
            return of(null);
          })
        )
    ]).pipe(
      switchMap((result: [Podcast, Podcast]) => {
        if (result[1]) {
          return of(result).pipe(
            map(res => {
              const podcast: Podcast = res[0];
              podcast.id = res[1].id;
              podcast.userId = res[1].userId;
              podcast.followed = res[1].followed;

              podcast.podcastEpisode.forEach((ep: PodcastEpisode) => {
                const followedEpisode = res[1].podcastEpisode.find(
                  x => x.audioUrl === ep.audioUrl
                );
                ep.id = followedEpisode && followedEpisode.id;
                ep.timeStep = followedEpisode && followedEpisode.timeStep;
                ep.followedPodcastId = podcast.id;
              });

              return podcast;
            })
          );
        } else {
          return of(result).pipe(
            switchMap(res => {
              const requestPod: FollowedPodcast = (({
                userId,
                title,
                imageUrl,
                rss,
                lastListened
              }) => ({
                userId,
                title,
                imageUrl,
                rss,
                followed: false,
                lastListened
              }))(res[0]);

              requestPod.userId = this.authService.currentUserValue.id;
              console.log(requestPod.userId);

              return this.ajaxComm
                .post({
                  control: 'FollowedPodcasts',
                  data: requestPod
                })
                .pipe(
                  map(x => {
                    res[0].id = x.id;
                    return res[0];
                  })
                );
            })
          );
        }
      })
    );
  }

  private extractFeeds(res: string, url: string) {
    const rss = JSON.parse(res).rss.channel;

    const podcast = {
      title: rss.title,
      description: rss['itunes:summary'] || rss.description,
      imageUrl: rss['itunes:image']['@href'],
      rss: url,

      podcastEpisode: rss.item.map(
        x =>
          ({
            description: x.description,
            audioUrl: x.enclosure && x.enclosure['@url'],
            audioType: x.enclosure && x.enclosure['@type'],
            imageUrl: x['itunes:image'] && x['itunes:image']['@href'],
            summary: x['itunes:summary'],
            pubDate: x.pubDate,
            title: x.title,
            duration:
              x['itunes:duration'] &&
              x['itunes:duration']
                .split(':')
                .reverse()
                .reduce((a, b, i) => {
                  return parseInt(a, 10) + parseInt(b, 10) * Math.pow(60, i);
                }, 0)
          } as PodcastEpisode)
      )
    } as Podcast;

    return podcast || {};
  }
}
