import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from '../../../../../../session';
import { CP_PRIVILEGES_MAP } from '../../../../../../shared/constants';
import { DashboardUtilsService } from '../../../dashboard.utils.service';
import { canSchoolReadResource } from '../../../../../../shared/utils/privileges';

@Component({
  selector: 'cp-dashboard-top-resource-title',
  templateUrl: './dashboard-top-resource-title.component.html',
  styleUrls: ['./dashboard-top-resource-title.component.scss']
})
export class DashboardTopResourceTitleComponent implements OnInit {
  @Input() item;
  @Input() resource: string;

  isSuperAdmin;
  isOrientation;
  canViewOrientation;

  constructor(
    public router: Router,
    public session: CPSession,
    public helper: DashboardUtilsService
  ) {}

  ngOnInit() {
    this.isOrientation = this.resource === 'orientation';
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);
    this.canViewOrientation = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation);
  }
}
