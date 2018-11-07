import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-experience-menu',
  templateUrl: './dashboard-experience-menu.component.html',
  styleUrls: ['./dashboard-experience-menu.component.scss']
})
export class DashboardExperienceMenuComponent implements OnInit {
  @Input() experiences;
  @Input() paramName;
  @Input() selectedPersona;

  constructor(public service: DashboardService, public session: CPSession, public router: Router) {}

  updateRouter({ action }) {
    this.router.navigate(['/dashboard'], {
      queryParamsHandling: 'merge',
      queryParams: {
        [this.paramName]: action
      }
    });
  }

  ngOnInit() {}
}
