import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from 'src/app/services/audio-player.service';
import { PodcastEpisode } from 'src/app/models/podcastEpisode';
import { AjaxCommService } from 'src/app/services/ajax-comm.service';
import { fromEvent } from 'rxjs';
import { debounceTime, auditTime } from 'rxjs/operators';
import { Podcast, FollowedPodcast } from 'src/app/models/podcast';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  audioPlayer: any;
  playPause: any;
  playpauseBtn: any;
  loading: any;
  progress: any;
  sliders: any;
  volumeBtn: any;
  volumeControls: any;
  volumeProgress: any;
  player: HTMLAudioElement;
  currentTime: any;
  totalTime: any;
  speaker: any;
  draggableClasses: string[];
  currentlyDragged: any;
  handleMethod: any;
  source: HTMLSourceElement;
  currentPodcast: PodcastEpisode;

  constructor(
    private audioService: AudioPlayerService,
    private ajaxComm: AjaxCommService,
    private authService: AuthenticationService
  ) {}

  isDraggable(el) {
    let canDrag = false;
    const classes = Array.from(el.classList);
    this.draggableClasses.forEach(function(draggable) {
      if (classes.indexOf(draggable) !== -1) {
        canDrag = true;
      }
    });
    return canDrag;
  }

  inRange(event) {
    const rangeBox = this.getRangeBox(event);
    const rect = rangeBox.getBoundingClientRect();
    const direction = rangeBox.dataset.direction;
    if (direction === 'horizontal') {
      const min = rect.left;
      const max = rect.right;
      if (event.clientX < min || event.clientX > max) {
        return false;
      }
    } else {
      const min = rect.top;
      const max = min + rangeBox.offsetHeight;
      if (event.clientY < min || event.clientY > max) {
        return false;
      }
    }
    return true;
  }

  updateProgress() {
    const current = this.player.currentTime;
    const percent = (current / this.player.duration) * 100;
    this.progress.style.width = percent + '%';

    this.currentTime.textContent = this.formatTime(current);
  }

  updateVolume() {
    this.volumeProgress.style.height = this.player.volume * 100 + '%';
    if (this.player.volume >= 0.5) {
      this.speaker.attributes.d.value =
        // tslint:disable-next-line:max-line-length
        'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
    } else if (this.player.volume < 0.5 && this.player.volume > 0.05) {
      this.speaker.attributes.d.value =
        'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
    } else if (this.player.volume <= 0.05) {
      this.speaker.attributes.d.value =
        'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
    }
  }

  getRangeBox(event) {
    let rangeBox = event.target;
    const el = this.currentlyDragged;
    if (event.type === 'click' && this.isDraggable(event.target)) {
      rangeBox = event.target.parentElement.parentElement;
    }
    if (event.type === 'mousemove') {
      rangeBox = el.parentElement.parentElement;
    }
    return rangeBox;
  }

  getCoefficient(event) {
    const slider = this.getRangeBox(event);
    const rect = slider.getBoundingClientRect();
    let K = 0;
    if (slider.dataset.direction === 'horizontal') {
      const offsetX = event.clientX - rect.left;
      const width = slider.clientWidth;
      K = offsetX / width;
    } else if (slider.dataset.direction === 'vertical') {
      const height = slider.clientHeight;
      const offsetY = event.clientY - rect.top;
      K = 1 - offsetY / height;
    }
    return K;
  }

  rewind(event) {
    if (this.inRange(event)) {
      this.player.currentTime =
        this.player.duration * this.getCoefficient(event);
    }
  }

  changeVolume(event) {
    if (this.inRange(event)) {
      this.player.volume = this.getCoefficient(event);
    }
  }

  formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
  }

  togglePlay() {
    this.audioService.togglePlay();
  }

  directionAware() {
    // if (window.innerHeight < 250) {
    //   this.volumeControls.style.bottom = '-54px';
    //   this.volumeControls.style.left = '54px';
    // } else if (this.audioPlayer.offsetTop < 154) {
    //   this.volumeControls.style.bottom = '-164px';
    //   this.volumeControls.style.left = '-3px';
    // } else {
    this.volumeControls.style.bottom = '52px';
    this.volumeControls.style.left = '-3px';
  }

  ngOnInit() {
    this.audioPlayer = document.querySelector('.green-audio-player');
    this.playPause = this.audioPlayer.querySelector('#playPause');
    this.playpauseBtn = this.audioPlayer.querySelector('.play-pause-btn');

    this.progress = this.audioPlayer.querySelector('.progress');
    this.sliders = this.audioPlayer.querySelectorAll('.slider');
    this.volumeBtn = this.audioPlayer.querySelector('.volume-btn');
    this.volumeControls = this.audioPlayer.querySelector('.volume-controls');
    this.volumeProgress = this.volumeControls.querySelector(
      '.slider .progress'
    );
    this.player = this.audioPlayer.querySelector('audio');
    this.source = this.player.querySelector('source');
    this.currentTime = this.audioPlayer.querySelector('.current-time');
    this.totalTime = this.audioPlayer.querySelector('.total-time');
    this.speaker = this.audioPlayer.querySelector('#speaker');

    this.draggableClasses = ['pin'];
    this.currentlyDragged = null;

    window.addEventListener('mousedown', event => {
      if (!this.isDraggable(event.target)) {
        return false;
      }
      this.currentlyDragged = event.target;
      this.handleMethod = this.currentlyDragged.dataset.method;
    });

    window.addEventListener(
      'mousemove',
      ev => {
        if (this.currentlyDragged) {
          this[this.handleMethod](ev);
        }
      },
      false
    );

    window.addEventListener(
      'mouseup',
      () => {
        this.currentlyDragged = false;
      },
      false
    );

    this.playpauseBtn.addEventListener('click', () => this.togglePlay());
    this.player.addEventListener('timeupdate', () => this.updateProgress());
    this.player.addEventListener('volumechange', () => this.updateVolume());
    this.player.addEventListener('loadedmetadata', () => {
      this.totalTime.textContent = this.formatTime(this.player.duration);
    });

    this.player.addEventListener('ended', () => {
      this.playPause.attributes.d.value = 'M18 12L0 24V0';
      this.player.currentTime = 0;
    });

    this.volumeBtn.addEventListener('click', () => {
      this.volumeBtn.classList.toggle('open');
      this.volumeControls.classList.toggle('hidden');
    });

    window.addEventListener('resize', () => this.directionAware());

    this.sliders.forEach(slider => {
      const pin = slider.querySelector('.pin');
      slider.addEventListener('click', ev => this[pin.dataset.method](ev));
    });

    this.audioService.isPlaying.subscribe(playing => {
      if (playing) {
        this.player.play();
      } else {
        this.player.pause();
      }
    });

    this.audioService.currentPodcast.subscribe(x => {
      if (this.player) {
        this.player.src = x.episode.audioUrl;

        this.player.currentTime = x.episode.timeStep || 0;

        this.currentPodcast = x.episode;

        if (!x.episode.id) {
          this.ajaxComm
            .post({
              control: 'PodcastEpisodes',
              data: x.episode,
              notify: false
            })
            .subscribe(p => {
              x.episode.id = p.id;
              x.episode.timeStep = p.timeStep;
            });
        }

        const requestPod: FollowedPodcast = (({
          userId,
          title,
          imageUrl,
          rss,
          followed,
          id,
          lastListened,
          category
        }) => ({
          userId: this.authService.currentUserValue.id,
          title,
          imageUrl,
          rss,
          followed,
          id,
          lastListened,
          category
        }))(x.podcast);

        requestPod.lastListened = new Date();
        this.ajaxComm
          .put({
            control: 'followedPodcasts',
            params: { rss: x.podcast.rss },
            data: requestPod
          })
          .subscribe();
      }
    });

    fromEvent(this.player, 'timeupdate')
      .pipe(auditTime(1000))
      .subscribe(x => {
        if (this.currentPodcast.id) {
          this.currentPodcast.timeStep = Math.floor(this.player.currentTime);
          this.ajaxComm
            .put({
              notify: false,
              control: 'PodcastEpisodes',
              params: { id: this.currentPodcast.id.toString() },
              data: (({ id, audioUrl, timeStep, followedPodcastId }) => ({
                id,
                audioUrl,
                timeStep,
                followedPodcastId
              }))(this.currentPodcast)
            })
            .subscribe();
        }
      });
  }
}
