import { Component, OnInit } from '@angular/core';

import { permissions } from './permissions';
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
  selector: 'cp-team-select-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class BaseTeamSelectModalComponent extends BaseComponent implements OnInit {
  title;
  loading;
  privileges;
  query = null;
  privilegeType;
  state: IState = state;

  constructor() {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onCheckedItem(checked, service) {
    this.updateItem(service.id, 'checked', checked);
  }

  updateItem(id: number, key: string, value: any) {
    let _state = Object.assign({}, this.state);

    _state.selected.forEach(service => {
      if (service.id === id) {
        service[key] = value;
      }
    });
  }

  removeSelectedItem(service) {
    this.updateItem(service.id, 'checked', false);
  }

  fetch(stream$) {
    super
    .fetchData(stream$)
    .then(res => {
      this.updateState(res.data);
    })
    .catch(err => console.log(err));
  }

  onSubmit() {
    let _item = {};
    let _state = [...this.state.selected];

    _state.map(item => {

      if (item.checked) {
        _item[item.data.store_id] = {
          [this.privilegeType]: {
            r: true,
            w: item.type === 1 ? false : true
          }
        };
      }
    });
    return _item;
  }

  private updateState(items) {
    let _selected = [];

    items.forEach(service => {
      _selected.push({
        id: service.id,
        type: 1,
        checked: false,
        data: service
      });
    });

    this.state = Object.assign({}, this.state, {selected: _selected});
  }

  buildPrivilegesDropDown() {
    this.privileges = permissions;
  }

  ngOnInit() { }
}
