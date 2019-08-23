import { tap, takeUntil, filter, map, take } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { BaseComponent } from '@campus-cloud/base';
import { FORMAT } from '@campus-cloud/shared/pipes/date/date.pipe';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model';

@Component({
  selector: 'cp-events-integrations',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class EventsIntegrationsListComponent extends BaseComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  showDeleteModal = false;
  showCreateModal = false;
  dateFormat = FORMAT.DATETIME;
  loading$: Observable<boolean>;
  selectedIntegration: IEventIntegration = null;
  integrations$: Observable<IEventIntegration[]>;
  stores$: Observable<Array<{ label: string; value: number }>>;

  constructor(
    public cpI18n: CPI18nService,
    public store: Store<fromStore.IEventIntegrationState | fromRoot.IHeader | fromRoot.ISnackbar>
  ) {
    super();
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSyncNow(feedId: number) {
    this.store
      .select(fromStore.getIntegrationById(feedId))
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe((integration) => {
        this.store.dispatch(
          new fromStore.SyncNow({
            integration,
            error: this.cpI18n.translate('something_went_wrong')
          })
        );
      });
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
      endRange: this.endRange,
      startRange: this.startRange
    };
    this.store.dispatch(new fromStore.GetIntegrations(payload));
  }

  onLaunchCreateModal() {
    this.showCreateModal = true;

    setTimeout(() => $('#integrationCreate').modal({ keyboard: true, focus: true }));
  }

  onLaunchDeleteModal(integration: IEventIntegration) {
    this.showDeleteModal = true;
    this.selectedIntegration = integration;

    setTimeout(() => $('#integrationDelete').modal({ keyboard: true, focus: true }));
  }

  onDeleteClick(integration: IEventIntegration) {
    const payload = {
      integration
    };

    this.store.dispatch(new fromStore.DeleteIntegration(payload));
  }

  listenForErrors() {
    this.store
      .select(fromStore.getIntegrationsError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => coerceBooleanProperty(error)),
        tap((body) => {
          const payload = {
            body,
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
