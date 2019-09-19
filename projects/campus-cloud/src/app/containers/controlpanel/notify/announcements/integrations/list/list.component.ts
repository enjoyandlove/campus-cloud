import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { OverlayRef } from '@angular/cdk/overlay';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { IAnnouncementsIntegration } from '../model';
import { ModalService, IStore } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { AnnouncementsIntegrationDeleteComponent } from '../delete';
import { AnnouncementsIntegrationCreateComponent } from '../create';

@Component({
  selector: 'cp-announcements-integrations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AnnouncementsIntegrationListComponent extends BaseComponent
  implements OnInit, OnDestroy {
  activeModal: OverlayRef;
  loading$: Observable<boolean>;
  senders$: Observable<IStore[]>;
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
        onAction: this.onDelete.bind(this),
        onClose: this.onActiveModalTearDown.bind(this)
      }
    );
  }

  onDelete(integration: IAnnouncementsIntegration) {
    this.store.dispatch(new fromStore.DeleteIntegrations({ integration }));
  }

  fetch() {
    this.store.dispatch(new fromStore.GetIntegrations());
  }

  ngOnInit() {
    this.loading$ = this.store.select(fromStore.getLoading);
    this.integrations$ = this.store.select(fromStore.getIntegrations);
    this.senders$ = this.store.select(fromStore.getSenders).pipe(
      tap((stores: IStore[]) => {
        if (!stores.length) {
          this.store.dispatch(new fromStore.GetSenders());
        }
      })
    );

    this.updateHeader();
    this.fetch();
  }

  ngOnDestroy() {
    this.store.dispatch(new fromStore.Destroy());
  }
}
