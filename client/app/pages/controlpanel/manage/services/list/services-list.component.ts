import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent extends BaseComponent implements OnInit, OnDestroy {
  loading;
  services;
  deleteService = '';

  constructor(
    private store: Store<IHeader>,
    private service: ServicesService
  ) {
    super();
    this.buildHeader();
    this.fetch(this.service.getServices());
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch(stream$) {
    super
      .fetchData(stream$)
      .then(res => {
        this.services = res;
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../manage.header.json')
    });
  }

  doFilter(state) {
    let search = new URLSearchParams();

    search.append('attendance_only', state.attendance_only);

    this.fetch(this.service.getServices(search));
  }

  onDelete(service) {
    this.deleteService = service;
  }

  ngOnDestroy() {
    // console.log('destroy');

  }

  ngOnInit() { }
}
