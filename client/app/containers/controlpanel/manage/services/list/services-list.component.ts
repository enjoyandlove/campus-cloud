import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ServicesService } from '../services.service';
import { CPSession } from './../../../../../session/index';
import { ManageHeaderService } from './../../utils/header';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

interface IState {
  search_text: string;
  attendance_only: number;
  services: Array<any>;
}

const state: IState = {
  services: [],
  search_text: null,
  attendance_only: 0
};

@Component({
  selector: 'cp-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent extends BaseComponent implements OnInit, OnDestroy {
  loading;
  deleteService = '';
  state: IState = state;

  constructor(
    private session: CPSession,
    private store: Store<IHeader>,
    private service: ServicesService,
    private headerService: ManageHeaderService
  ) {
    super();
    this.buildHeader();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search = new URLSearchParams();
    let attendance_only = this.state.attendance_only ?
      this.state.attendance_only.toString() : null;

    search.append('attendance_only', attendance_only);
    search.append('search_text', this.state.search_text);
    search.append('school_id', this.session.school.id.toString());

    const stream$ = this.service.getServices(this.startRange, this.endRange, search);

    super
      .fetchData(stream$)
      .then(res => {
        this.state = Object.assign({}, this.state, { services: res.data });
      })
      .catch(err => { throw new Error(err) });
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

    this.fetch();
  }

  onDelete(service) {
    this.deleteService = service;
  }

  onDeleted(serviceId: number) {
    this.deleteService = '';
    let _state = Object.assign({}, this.state);

    _state.services = _state.services.filter(service => service.id !== serviceId);

    this.state = Object.assign({}, this.state, { services: _state.services });
  }

  ngOnDestroy() {
    // console.log('destroy');
  }

  ngOnInit() {
    this.fetch();
  }
}
