import { Component, OnInit, Input } from '@angular/core';
import { PodcastEpisode } from 'src/app/models/podcastEpisode';
import { MatDialog } from '@angular/material';
import { SummaryDialogComponent } from '../summary-dialog/summary-dialog.component';
import { AudioPlayerService } from 'src/app/services/audio-player.service';
import { Podcast } from 'src/app/models/podcast';

@Component({
  selector: 'app-podcast-episode',
  templateUrl: './podcast-episode.component.html',
  styleUrls: ['./podcast-episode.component.css']
})
export class PodcastEpisodeComponent implements OnInit {
  @Input() episode: PodcastEpisode;
  @Input() podcast: Podcast;
  constructor(
    private dialog: MatDialog,
    private audioService: AudioPlayerService
  ) {}

  ngOnInit() {}

  onClickSummary(ep: PodcastEpisode) {
    const dialogRef = this.dialog.open(SummaryDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: ep
    });
  }

  onPlay() {
    this.audioService.switchPodcast(this.episode, this.podcast);
  }

  getProgress() {
    return this.episode.id
      ? (this.episode.timeStep / this.episode.duration) * 100
      : 0;
  }
}
