import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { tap, takeUntil, filter, map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '../../../../../../store';
import { BaseComponent } from '../../../../../../base';
import { CPSession } from './../../../../../../session';
import { EventsIntegrationEditComponent } from '../edit';
import { EventIntegration } from './../model/integration.model';
import { FORMAT } from './../../../../../../shared/pipes/date/date.pipe';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-events-integrations',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class EventsIntegrationsListComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild(EventsIntegrationEditComponent) editModal: EventsIntegrationEditComponent;

  private destroy$ = new Subject();

  showEditModal = false;
  showDeleteModal = false;
  showCreateModal = false;
  dateFormat = FORMAT.DATETIME;
  loading$: Observable<boolean>;
  selectedIntegration: EventIntegration = null;
  integrations$: Observable<EventIntegration[]>;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.IEventIntegrationState | fromRoot.IHeader | fromRoot.ISnackbar>
  ) {
    super();
  }

  get defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;

    return new HttpParams().set('school_id', school_id);
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onEditTeardown() {
    this.showEditModal = false;
    $('#integrationEdit').modal('hide');
  }

  onCreateTeardown() {
    this.showCreateModal = false;
    $('#integrationCreate').modal('hide');
  }

  onDeleteTeardown() {
    this.showDeleteModal = false;
    $('#integrationDelete').modal('hide');
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_shared_feature_integrations',
        subheading: null,
        em: null,
        crumbs: {
          url: 'events',
          label: 'events'
        },
        children: []
      }
    });
  }

  fetch() {
    const payload = {
      startRange: this.startRange,
      endRange: this.endRange,
      params: this.defaultParams
    };
    this.store.dispatch(new fromStore.GetIntegrations(payload));
  }

  onLaunchCreateModal() {
    this.showCreateModal = true;

    setTimeout(() => $('#integrationCreate').modal());
  }

  onLaunchEditModal() {
    this.showEditModal = true;

    setTimeout(() => $('#integrationEdit').modal());
  }

  listenForErrors() {
    this.store
      .select(fromStore.getIntegrationsError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          const payload = {
            body: this.cpI18n.translate('something_went_wrong'),
            sticky: true,
            autoClose: true,
            class: 'danger'
          };

          this.store.dispatch({
            type: fromRoot.baseActions.SNACKBAR_SHOW,
            payload
          });
        })
      )
      .subscribe();
  }

  listenForCompletedActions() {
    this.store
      .select(fromStore.getCompletedAction)
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => !!action),
        tap((phraseAppKey) => {
          const payload = {
            body: this.cpI18n.translate(phraseAppKey),
            sticky: true,
            autoClose: true,
            class: 'success'
          };
          this.store.dispatch({
            type: fromRoot.baseActions.SNACKBAR_SHOW,
            payload
          });
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.updateHeader();
    this.listenForErrors();
    this.listenForCompletedActions();
    this.integrations$ = this.store.select(fromStore.getIntegrations).pipe(
      map((res) => {
        const responseCopy = [...res];

        return super.updatePagination(responseCopy);
      })
    );
    this.loading$ = this.store
      .select(fromStore.getIntegrationsLoading)
      .pipe(takeUntil(this.destroy$));

    this.fetch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
    this.store.dispatch(new fromStore.Destroy());
  }
}
