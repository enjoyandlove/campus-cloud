import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-campus-tile',
  templateUrl: './dashboard-campus-tile.component.html',
  styleUrls: ['./dashboard-campus-tile.component.scss']
})
export class DashboardCampuTileComponent extends BaseComponent implements OnInit {
  @Input() personas;

  loading;
  items = [];
  selectedPersona;
  defaultImage = require('public/default/user.png');

  constructor(
    private session: CPSession,
    private service: DashboardService,
    public route: ActivatedRoute
  ) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
    });
  }

  fetch(start, end, experience_id) {
    const search = new HttpParams()
      .set('end', end)
      .set('start', start)
      .set('experience_id', experience_id)
      .set('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getCampusTile(search);

    super.fetchData(stream$).then((res) => (this.items = res.data));
  }

  ngOnInit() {
    this.route.queryParams.subscribe(({ start, end, c_activity_exp_id }) => {
      this.selectedPersona = this.personas.filter((p) => p.action === +c_activity_exp_id)[0];
      this.fetch(start, end, c_activity_exp_id);
    });
  }
}
