export class PodcastEpisode {
  description: string;
  audioType: string;
  audioUrl: string;
  imageUrl: string;
  pubDate: Date;
  summary: string;
  title: string;
  id?: number;
  timeStep?: number;
  followedPodcastId: number;
  duration: number;
}
