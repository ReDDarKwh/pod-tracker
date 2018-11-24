import { Component, OnInit } from '@angular/core';
import { PodcastEpisode } from 'src/app/models/podcastEpisode';
import { AudioPlayerService } from 'src/app/services/audio-player.service';

@Component({
  selector: 'app-current-podcast-info',
  templateUrl: './current-podcast-info.component.html',
  styleUrls: ['./current-podcast-info.component.css']
})
export class CurrentPodcastInfoComponent implements OnInit {
  episode: PodcastEpisode;
  constructor(private audioService: AudioPlayerService) {
    this.audioService.currentPodcast.subscribe(x => {
      this.episode = x.episode;
    });
  }

  ngOnInit() {}
}
