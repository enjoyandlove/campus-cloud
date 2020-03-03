import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { FeedsComponent } from './base';
import { FeedsService } from '../feeds.service';
import { CPSession } from '@campus-cloud/session';
import { GroupType } from '../feeds.utils.service';
import { ManageHeaderService } from '@controlpanel/manage/utils';
import { CPTrackingService, UserService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

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
    public userService: UserService,
    public cpTracking: CPTrackingService,
    private headerService: ManageHeaderService,
    public store: Store<fromStore.IWallsState>,
    public feedsAmplitudeService: FeedsAmplitudeService
  ) {
    super(session, service, cpTracking, store, userService, feedsAmplitudeService);
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  ngOnInit() {
    super.ngOnInit();
    this.headerService.updateHeader();
    this.groupType = GroupType.campus;
  }
}
