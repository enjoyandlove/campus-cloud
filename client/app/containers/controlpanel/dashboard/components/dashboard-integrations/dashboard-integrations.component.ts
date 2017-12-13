import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-integrations',
  templateUrl: './dashboard-integrations.component.html',
  styleUrls: ['./dashboard-integrations.component.scss']
})
export class DashboardIntegrationsComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  data;
  loading;

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }


  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getIntegrations(search)
    super
      .fetchData(stream$)
      .then(res => this.data = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
