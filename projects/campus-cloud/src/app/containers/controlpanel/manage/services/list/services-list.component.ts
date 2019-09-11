import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { ServicesDeleteComponent } from '../delete';
import { ServicesService } from '../services.service';
import { ServiceAttendance } from '../services.status';
import { ManageHeaderService } from './../../utils/header';
import { baseActionClass } from '@campus-cloud/store/base';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService, CPTrackingService, ModalService } from '@campus-cloud/shared/services';

interface IState {
  search_text: string;
  attendance_only: number;
  services: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  services: [],
  search_text: null,
  attendance_only: 0,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  sortingLabels;
  state: IState = state;
  activeModal: OverlayRef;
  attendanceEnabled = ServiceAttendance.enabled;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<ISnackbar>,
    private service: ServicesService,
    private modalService: ModalService,
    private cpTracking: CPTrackingService,
    private headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  private fetch() {
    const attendance_only = this.state.attendance_only
      ? this.state.attendance_only.toString()
      : null;

    const search = new HttpParams()
      .append('attendance_only', attendance_only)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('search_text', this.state.search_text)
      .append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getServices(this.startRange, this.endRange, search);

    super.fetchData(stream$).then(
      (res) => {
        this.state = Object.assign({}, this.state, { services: res.data });
      },
      () => this.handleError()
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  doFilter(data) {
    this.state = Object.assign({}, this.state, {
      search_text: data.search_text,
      attendance_only: data.attendance_only
    });

    this.resetPagination();
    this.fetch();
  }

  onDelete(service) {
    this.activeModal = this.modalService.open(
      ServicesDeleteComponent,
      {},
      {
        data: service,
        onClose: this.onDeleted.bind(this)
      }
    );
  }

  onDeleted(serviceId?: number) {
    this.modalService.close(this.activeModal);
    this.activeModal = null;

    if (serviceId) {
      this.state = {
        ...this.state,
        services: this.state.services.filter((s) => s.id !== serviceId)
      };
    }
  }

  ngOnInit() {
    this.headerService.updateHeader();
    this.fetch();
    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
