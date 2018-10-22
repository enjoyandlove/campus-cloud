import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { AudienceType } from './../audience.status';
import { AudienceService } from '../audience.service';
import { BaseComponent } from '../../../../base/base.component';
import { ISnackbar, baseActions } from '../../../../store/base';
import { CP_TRACK_TO } from '../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { createSpreadSheet } from './../../../../shared/utils/csv/parser';
import { CPI18nService, CPTrackingService } from '../../../../shared/services';

interface IState {
  audiences: Array<any>;
  search_str: string;
  sort_field: string;
  list_type: number;
  sort_direction: string;
}

const state: IState = {
  audiences: [],
  search_str: null,
  sort_field: 'name',
  list_type: null,
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-audience-list',
  templateUrl: './audience-list.component.html',
  styleUrls: ['./audience-list.component.scss']
})
export class AudienceListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  sortingLabels;
  audienceUsers;
  isAudienceEdit;
  isAudienceDelete;
  isAudienceImport;
  isAudienceCreate;
  state: IState = state;
  custom = AudienceType.custom;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private service: AudienceService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onImportError(err) {
    let message = this.cpI18n.translate('something_went_wrong');

    if (err === 'Database Error') {
      message = this.cpI18n.translate('audience_create_error_duplicate_audience');
    }

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: 'danger',
        body: message
      }
    });
  }

  onImportSuccess(newAudiences) {
    this.state = { ...this.state, audiences: [newAudiences, ...this.state.audiences] };

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        autoClose: true,
        class: 'success',
        body: this.cpI18n.translate('audience_import_success_message')
      }
    });
  }

  onFilterByListType(list_type) {
    this.state = { ...this.state, list_type };

    this.resetPagination();

    this.fetch();
  }

  downloadAudience(audience) {
    const columns = [this.cpI18n.translate('name'), this.cpI18n.translate('email')];
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service
      .getAudienceById(audience.id, search)
      .toPromise()
      .then(({ users, name }) => {
        const data = users.map((user) => {
          return {
            [this.cpI18n.translate('name')]: `${user.firstname} ${user.lastname}`,
            [this.cpI18n.translate('email')]: user.email
          };
        });
        createSpreadSheet(data, columns, `${name}`);
        this.trackDownloadAudience(audience.type);
      })
      .catch(() =>
        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body: this.cpI18n.translate('something_went_wrong')
          }
        })
      );
  }

  private fetch() {
    let search = new HttpParams()
      .set('search_str', this.state.search_str)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('school_id', this.session.g.get('school').id.toString());

    if (this.state.list_type !== null) {
      search = search.append('list_type', this.state.list_type.toString());
    }

    const stream$ = this.service.getAudiences(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then((res) => (this.state = Object.assign({}, this.state, { audiences: res.data })));
  }

  trackDownloadAudience(type) {
    const audience_type = type === AudienceType.custom
      ? amplitudeEvents.CUSTOM_AUDIENCE
      : amplitudeEvents.DYNAMIC_AUDIENCE;

    const eventProperties = {
      data_source: amplitudeEvents.MENU_AUDIENCE,
      audience_type
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_DATA,
      eventProperties
    );
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });
    this.resetPagination();

    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  onResetCreateAudience() {
    this.audienceUsers = [];
    this.isAudienceCreate = false;
  }

  onCreatedAudience() {
    this.fetch();
  }

  onLaunchCreateModal(users?: Array<any>) {
    this.isAudienceCreate = true;
    this.audienceUsers = users ? users : null;
    setTimeout(
      () => {
        $('#audienceCreate').modal();
      },

      1
    );
  }

  onLaunchImportModal() {
    this.isAudienceImport = true;
    setTimeout(
      () => {
        $('#audienceImport').modal();
      },

      1
    );
  }

  onEditedAudience() {
    this.fetch();
  }

  onDeletedAudience(audienceId: number) {
    this.isAudienceDelete = false;
    const _state = Object.assign({}, this.state);

    _state.audiences = _state.audiences.filter((audience) => {
      if (audience.id !== audienceId) {
        return audience;
      }

      return;
    });

    this.state = Object.assign({}, this.state, { audiences: _state.audiences });

    if (this.state.audiences.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };
  }
}
