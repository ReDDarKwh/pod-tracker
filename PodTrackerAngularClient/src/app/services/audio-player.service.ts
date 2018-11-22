import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PodcastEpisode } from '../models/podcastEpisode';
import { Podcast } from '../models/podcast';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private _playing: BehaviorSubject<boolean>;
  public isPlaying: Observable<boolean>;
  private _currentPodcast: Subject<{
    episode: PodcastEpisode;
    podcast: Podcast;
  }>;
  public currentPodcast: Observable<{
    episode: PodcastEpisode;
    podcast: Podcast;
  }>;

  /**
   *
   */
  constructor() {
    this._currentPodcast = new Subject();
    this.currentPodcast = this._currentPodcast.asObservable();

    this._playing = new BehaviorSubject(false);
    this.isPlaying = this._playing.asObservable();
  }

  togglePlay() {
    this._playing.next(!this._playing.value);
  }

  switchPodcast(episode: PodcastEpisode, podcast: Podcast) {
    this._currentPodcast.next({ episode, podcast });
    this._playing.next(true);
  }
}
