import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';
import { FollowedPodcastsComponent } from './components/followed-podcasts/followed-podcasts.component';
import { BrowseComponent } from './components/browse/browse.component';
import { PodcastComponent } from './components/podcast/podcast.component';
import { RecommendationComponent } from './components/recommendation/recommendation.component';

export const routerConfig: Routes = [
  {
    path: 'podcast/:rss/:genreId',
    component: PodcastComponent
  },
  {
    path: 'browse',
    component: BrowseComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'recommendation',
    component: RecommendationComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'followed',
    component: FollowedPodcastsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
