import { takeUntil, filter, tap, map, take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CPSession } from '@app/session';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';

import { BaseComponent } from '@app/base';
import { IItem } from '@shared/components';
import { CPI18nService } from '@shared/services/i18n.service';
import { coerceBooleanProperty } from '@shared/utils/coercion';
import { IWallsIntegration } from '@libs/integrations/walls/model';

@Component({
  selector: 'cp-walls-integrations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class WallsIntegrationsListComponent extends BaseComponent implements OnInit, OnDestroy {
  channels: IItem[];
  showEditModal = false;
  showCreateModal = false;
  showDeleteModal = false;
  destroy$ = new Subject();
  loading$: Observable<boolean>;
  selectedIntegration: IWallsIntegration;
  integrations$: Observable<IWallsIntegration[]>;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    public store: Store<fromStore.IWallsIntegrationState>
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

  onSyncNow(feedId: number) {
    this.store
      .select(fromStore.getIntegrationById(feedId))
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((integration) => {
        this.store.dispatch(
          new fromStore.SyncNow({
            integration,
            error: this.cpI18n.translate('something_went_wrong')
          })
        );
      });
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_shared_feature_integrations',
        subheading: null,
        em: null,
        crumbs: {
          url: 'feeds',
          label: 'feeds'
        },
        children: []
      }
    });
  }

  fetch() {
    const payload = {
      endRange: this.endRange,
      params: this.defaultParams,
      startRange: this.startRange
    };
    this.store.dispatch(new fromStore.GetIntegrations(payload));
  }

  onLaunchCreateModal() {
    this.showCreateModal = true;

    setTimeout(() => $('#integrationCreate').modal());
  }

  onLaunchEditModal(integration: IWallsIntegration) {
    this.showEditModal = true;
    this.selectedIntegration = integration;

    setTimeout(() => $('#integrationEdit').modal());
  }

  onLaunchDeleteModal(integration: IWallsIntegration) {
    this.showDeleteModal = true;
    this.selectedIntegration = integration;

    setTimeout(() => $('#integrationDelete').modal());
  }

  onDeleteClick(integration: IWallsIntegration) {
    const params = this.defaultParams;

    const payload = {
      params,
      integrationId: integration.id
    };

    this.store.dispatch(new fromStore.DeleteIntegration(payload));
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

  loadSocialPostCategories() {
    this.store
      .select(fromStore.getSocialPostCategories)
      .pipe(
        takeUntil(this.destroy$),
        tap((socialPostCategories) => {
          if (!socialPostCategories.length) {
            this.store.dispatch(
              new fromStore.GetSocialPostCategories({ params: this.defaultParams })
            );
          }
        })
      )
      .subscribe((channels) => (this.channels = channels));
  }

  ngOnInit(): void {
    this.updateHeader();
    this.listenForErrors();
    this.loadSocialPostCategories();
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
  }
}
