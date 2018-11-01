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
  @Input() personas;
  @Input() paramName;
  @Input() selectedPersona;

  constructor(public service: DashboardService, public session: CPSession, public router: Router) {}

  onSelected({ action }) {
    this.updateRouter(action);
  }

  updateRouter(experience_id) {
    this.router.navigate(['/dashboard'], {
      queryParamsHandling: 'merge',
      queryParams: {
        [this.paramName]: experience_id
      }
    });
  }

  ngOnInit() {}
}
