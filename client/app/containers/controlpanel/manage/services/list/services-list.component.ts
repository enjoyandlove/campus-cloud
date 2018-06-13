import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { ServicesService } from '../services.service';
import { CPSession } from './../../../../../session/index';
import { ManageHeaderService } from './../../utils/header';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

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
  deleteService = '';
  state: IState = state;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private service: ServicesService,
    private headerService: ManageHeaderService
  ) {
    super();
    this.buildHeader();
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

    super.fetchData(stream$).then((res) => {
      this.state = Object.assign({}, this.state, { services: res.data });
    });
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
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
    this.deleteService = service;
  }

  onDeleted(serviceId: number) {
    this.deleteService = '';
    const _state = Object.assign({}, this.state);

    _state.services = _state.services.filter((service) => service.id !== serviceId);

    this.state = Object.assign({}, this.state, { services: _state.services });
  }

  ngOnInit() {
    this.fetch();
  }
}
