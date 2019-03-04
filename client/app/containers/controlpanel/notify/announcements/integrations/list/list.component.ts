import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IAnnoucementsIntegration } from '../model';
import { BaseComponent } from '@app/base/base.component';

@Component({
  selector: 'cp-announcements-integrations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AnnouncementsIntegrationListComponent extends BaseComponent implements OnInit {
  loading$: Observable<boolean>;
  integrations$: Observable<IAnnoucementsIntegration[]>;

  constructor(
    private session: CPSession,
    private store: Store<fromRoot.IHeader | fromStore.IAnnoucementsIntegrationState>
  ) {
    super();
  }

  get defaultParams(): HttpParams {
    const schoolId = this.session.g.get('school').id;

    return new HttpParams().set('school_id', schoolId);
  }

  onPaginationNext() {
    super.goToNext();
  }

  onPaginationPrevious() {
    super.goToPrevious();
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_shared_feature_integrations',
        subheading: null,
        em: null,
        crumbs: {
          url: 'announcements',
          label: 'announcements'
        },
        children: []
      }
    });
  }

  onLaunchCreateModal() {
    console.log('onLaunchCreateModal');
  }

  onSyncNow() {
    console.log('onSyncNow');
  }

  onLaunchDeleteModal() {
    console.log('onLaunchDeleteModal');
  }

  fetch() {
    this.store.dispatch(new fromStore.GetIntegrations());
  }

  ngOnInit() {
    this.loading$ = this.store.select(fromStore.getLoading);
    this.integrations$ = this.store.select(fromStore.getIntegrations);

    this.updateHeader();
    this.fetch();
  }
}
