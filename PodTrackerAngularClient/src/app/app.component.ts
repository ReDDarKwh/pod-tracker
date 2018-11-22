import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { HeaderService } from './services/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PodTracker';

  @ViewChild(MatSidenav) drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthenticationService,
    private router: Router,
    private headerService: HeaderService
  ) {
    headerService.titleSubject.subscribe(title => {
      this.title = title;
    });
  }

  toggleMenu() {
    this.isHandset$.pipe(take(1)).subscribe(matches => {
      if (matches) {
        this.drawer.toggle();
      }
    });
  }

  logout() {
    this.auth.logout();

    this.router.navigate(['/browse']);
  }
}
