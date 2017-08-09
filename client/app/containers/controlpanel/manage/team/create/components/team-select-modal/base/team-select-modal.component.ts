import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { permissions } from '../permissions';
import { BaseComponent } from '../../../../../../../../base/base.component';

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
  @Input() title: string;
  @Input() defaultState: any;
  @Input() data: Observable<any>;
  @Input() privilegeType: number;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  loading;
  privileges;
  query = null;
  state: IState = state;

  constructor() {
    super();
    this.privileges = permissions;
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

  onSubmit() {
    let _item = {};
    let _state = [...this.state.selected];

    _state.map(item => {
      if (item.checked) {
        _item['store_id' in item.data ? item.data.store_id : item.data.id] = {
          [this.privilegeType]: {
            r: true,
            w: item.type === 1 ? false : true
          }
        };
      }
    });

    this.submit.emit(_item);
  }

  updateState(items) {
    let _selected = [];

    items.forEach(item => {
      _selected.push({
        id: item.id,
        type: 1,
        checked: item.checked || false,
        data: item
      });
    });
    this.state = Object.assign({}, this.state, {selected: _selected});
  }

  ngOnInit() {
    this.data.subscribe(res => {
      this.loading = 'data' in res;
      if (res.data) {
        this.updateState(res.data);
      }
      if (res.selected) {
        Object.keys(res.selected).forEach(storeId => {
          let type = res.selected[storeId].w ? 2 : 1;
          this.updateItem(res.selected[storeId].id, 'type', type);
        });
      }
    });
  }
}
