import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { ModalService } from '@shared/services';
import { IAnnouncementsIntegration } from '../model';
import { BaseComponent } from '@app/base/base.component';
import { AnnouncementsIntegrationDeleteComponent } from '../delete';
import { AnnouncementsIntegrationCreateComponent } from '../create';

@Component({
  selector: 'cp-announcements-integrations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AnnouncementsIntegrationListComponent extends BaseComponent implements OnInit {
  activeModal: OverlayRef;
  loading$: Observable<boolean>;
  integrations$: Observable<IAnnouncementsIntegration[]>;

  constructor(
    private session: CPSession,
    private modalService: ModalService,
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
    this.activeModal = this.modalService.open(
      AnnouncementsIntegrationCreateComponent,
      {},
      {
        onClose: this.onActiveModalTearDown.bind(this)
      }
    );
  }

  onSyncNow() {
    console.log('onSyncNow');
  }

  onActiveModalTearDown() {
    this.modalService.close(this.activeModal);
    this.activeModal = null;
  }

  onLaunchDeleteModal(integration: IAnnouncementsIntegration) {
    this.activeModal = this.modalService.open(
      AnnouncementsIntegrationDeleteComponent,
      {},
      {
        data: integration,
        onClose: this.onActiveModalTearDown.bind(this)
      }
    );
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
