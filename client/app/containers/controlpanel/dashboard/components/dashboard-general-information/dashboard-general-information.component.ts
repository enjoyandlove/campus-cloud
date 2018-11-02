import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-general-information',
  templateUrl: './dashboard-general-information.component.html',
  styleUrls: ['./dashboard-general-information.component.scss']
})
export class DashboardGeneralInformationComponent extends BaseComponent implements OnInit {
  @Input() personas;

  data;
  loading;
  selectedPersona;

  constructor(
    private session: CPSession,
    public route: ActivatedRoute,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
    });
  }

  fetch(start, end, persona_id) {
    const search = new HttpParams()
      .append('end', end)
      .append('start', start)
      .append('persona_id', persona_id)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getGeneralInformation(search);

    super.fetchData(stream$).then((res) => {
      this.data = res.data;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(({ start, end, gen_info_exp_id }) => {
      if (start && end && gen_info_exp_id) {
        this.selectedPersona = this.personas.filter((p) => p.action === +gen_info_exp_id)[0];
        this.fetch(start, end, gen_info_exp_id);
      }
    });
  }
}
