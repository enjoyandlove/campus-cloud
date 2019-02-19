import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '@app/store';

import { FeedsComponent } from './base';
import { FeedsService } from '../feeds.service';
import { CPSession } from '../../../../../session';
import { GroupType } from '../feeds.utils.service';
import { ManageHeaderService } from '@containers/controlpanel/manage/utils';

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
    private store: Store<fromRoot.IHeader>,
    private headerService: ManageHeaderService
  ) {
    super(session, service);
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  buildHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }

  ngOnInit() {
    this.buildHeader();
    this.groupType = GroupType.campus;
  }
}
