import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';

import { FeedsComponent } from './base';
import { FeedsService } from '../feeds.service';
import { CPSession } from '@campus-cloud/session';
import { GroupType } from '../feeds.utils.service';
import { ManageHeaderService } from '@controlpanel/manage/utils';
import { CPTrackingService, UserService } from '@campus-cloud/shared/services';

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
    public cpTracking: CPTrackingService,
    private headerService: ManageHeaderService,
    private store: Store<fromStore.IWallsState>,
    private userService: UserService
  ) {
    super(session, service, cpTracking);
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  ngOnInit() {
    this.fetchBannedEmails();
    this.headerService.updateHeader();
    this.groupType = GroupType.campus;
  }

  private fetchBannedEmails() {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());
    this.userService
      .getAll(params, 1, 10000)
      .pipe(
        map((students: any[]) => students.filter((s) => s.social_restriction).map((s) => s.email))
      )
      .subscribe(
        (emails) => this.store.dispatch(fromStore.setBannedEmails({ emails })),
        () => this.store.dispatch(fromStore.setBannedEmails({ emails: [] }))
      );
  }
}
