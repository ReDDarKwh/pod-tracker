import { HeaderService } from './../../services/header.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AjaxCommService } from '../../services/ajax-comm.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private ajaxComm: AjaxCommService,
    private router: Router
  ) {
    this.headerService.titleSubject.next('Recommendations');
  }

  ngOnInit() {}
}
