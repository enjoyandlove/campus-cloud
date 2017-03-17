import { Component, OnInit } from '@angular/core';

import { servicesPermissions } from './permissions';
import { ServicesService } from '../../../../services/services.service';
import { BaseComponent } from '../../../../../../../base/base.component';

interface ISelected {
  id: number;
  type: number;
  checked: boolean;
  data: any;
}

interface IState {
  selected: Array<ISelected>;
}

const state: IState = {
  selected: []
};

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './select-services-modal.component.html',
  styleUrls: ['./select-services-modal.component.scss']
})
export class SelectServicesModalComponent extends BaseComponent implements OnInit {
  loading;
  services;
  privileges;
  query = null;
  state: IState = state;
  userPrivileges = [1, 2];

  constructor(
    private servicesService: ServicesService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  onCheckedService(checked, service) {
    this.updateService(service.id, 'checked', checked);
  }

  updateService(id: number, key: string, value: any) {
    let _state = Object.assign({}, this.state);

    _state.selected.forEach(service => {
      if (service.id === id) {
        service[key] = value;
      }
    });
  }

  removeSelectedService(service) {
    this.updateService(service.id, 'checked', false);
  }

  private fetch() {
    super
    .fetchData(this.servicesService.getServices())
    .then(res => {
      this.services = res;
      this.updateState();
    })
    .catch(err => console.log(err));
  }

  onSubmit() {
    let _results = [];

    this.state.selected.forEach(srv => {
      if (srv.checked) {
        _results.push(srv);
      }
    });
  }

  private updateState() {
    let _selected = [];
    this.services.forEach(service => {
      _selected.push({
        id: service.id,
        type: 1,
        checked: false,
        data: service
      });
    });

    this.state = Object.assign({}, this.state, {selected: _selected});
  }

  ngOnInit() {
    this.privileges = servicesPermissions.filter(privilege => {
      if (this.userPrivileges.indexOf(privilege.type) > -1) {
        return privilege;
      }
    });
  }
}
