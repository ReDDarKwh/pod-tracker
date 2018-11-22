import { PodcastEpisode } from './podcastEpisode';

export class FollowedPodcast {
  id?: number;
  userId?: number;
  title: string;
  imageUrl: string;
  rss: string;
  followed: boolean;
  lastListened: Date;
}

export class Podcast extends FollowedPodcast {
  podcastEpisode: PodcastEpisode[];
  description: string;
}
