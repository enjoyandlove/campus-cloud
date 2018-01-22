import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { permissions } from '../permissions';

import { BaseComponent } from '../../../../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from './../../../../../../../../shared/constants';

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
  selected: [],
};

@Component({
  selector: 'cp-team-select-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss'],
})
export class BaseTeamSelectModalComponent extends BaseComponent
  implements OnInit {
  @Input() title: string;
  @Input() defaultState: any;
  @Input() data: Observable<any>;
  @Input() privilegeType: number;
  @Input() reset: Observable<boolean>;
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
    const _state = Object.assign({}, this.state);

    _state.selected.forEach((service) => {
      if (service.id === id) {
        service[key] = value;
      }
    });
  }

  removeSelectedItem(service) {
    this.updateItem(service.id, 'checked', false);
  }

  emitAndClose() {
    this.onSubmit();
  }

  onSubmit() {
    const _item = {};
    const _state = [...this.state.selected];

    _state.map((item) => {
      if (item.checked) {
        _item['store_id' in item.data ? item.data.store_id : item.data.id] = {
          [this.privilegeType]: {
            r: true,
            w: true,
          },
          [CP_PRIVILEGES_MAP.events]: {
            r: true,
            w: true,
          },
          [CP_PRIVILEGES_MAP.event_attendance]: {
            r: true,
            w: true,
          },
        };

        // if its a club we grant them access to extra privileges
        if (!('store_id' in item.data)) {
          _item[item.data.id] = Object.assign({}, _item[item.data.id], {
            [CP_PRIVILEGES_MAP.moderation]: {
              r: true,
              w: true,
            },
            [CP_PRIVILEGES_MAP.membership]: {
              r: true,
              w: true,
            },
          });
        }
      }
    });

    this.submit.emit(_item);
  }

  updateState(items) {
    const _selected = [];

    items.forEach((item) => {
      _selected.push({
        id: item.id,
        type: 1,
        checked: item.checked || false,
        data: item,
      });
    });
    this.state = Object.assign({}, this.state, { selected: _selected });
  }

  doReset() {
    this.state = Object.assign({}, this.state, {
      selected: this.state.selected.map((item) => {
        item.checked = false;

        return item;
      }),
    });
  }

  ngOnInit() {
    this.reset.subscribe((reset) => {
      if (reset) {
        this.doReset();
      }
    });

    this.data.subscribe((res) => {
      this.loading = 'data' in res;

      if (res.data) {
        this.updateState(res.data);
      }

      if (res.selected) {
        Object.keys(res.selected).forEach((storeId) => {
          const type = res.selected[storeId].w ? 2 : 1;
          this.updateItem(res.selected[storeId].id, 'type', type);
        });
      }
    });
  }
}
