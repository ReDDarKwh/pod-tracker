import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { PodcastEpisode } from 'src/app/models/podcastEpisode';

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.css']
})
export class SummaryDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PodcastEpisode) {}

  ngOnInit() {}
}
