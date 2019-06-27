import { Component, OnInit } from '@angular/core';

import { FeedsComponent } from './base';
import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../feeds.service';
import { GroupType } from '../feeds.utils.service';
import { ManageHeaderService } from '@controlpanel/manage/utils';

@Component({
  selector: 'cp-feeds-list',
  templateUrl: './base/feeds.component.html',
  styleUrls: ['./base/feeds.component.scss']
})
export class FeedsListComponent extends FeedsComponent implements OnInit {
  feeds;
  loading;

  constructor(
    public session: CPSession,
    public service: FeedsService,
    private headerService: ManageHeaderService
  ) {
    super(session, service);
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  ngOnInit() {
    this.headerService.updateHeader();
    this.groupType = GroupType.campus;
  }
}
