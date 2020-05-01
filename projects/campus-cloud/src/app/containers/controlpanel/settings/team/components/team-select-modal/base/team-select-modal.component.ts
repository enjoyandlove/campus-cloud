import {
  OnInit,
  Input,
  Output,
  Component,
  OnDestroy,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { get as _get } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { permissions, permissionType, permissionIcon } from '../permissions';
import {
  canSchoolWriteResource,
  canStoreReadAndWriteResource
} from '@campus-cloud/shared/utils/privileges';

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

@Mixin([Destroyable])
@Component({
  selector: 'cp-team-select-modal',
  templateUrl: './team-select-modal.component.html',
  styleUrls: ['./team-select-modal.component.scss']
})
export class BaseTeamSelectModalComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() privileges: any;
  @Input() title: string;
  @Input() defaultState: any;
  @Input() data: Observable<any>;
  @Input() privilegeType: number;
  @Input() reset: Observable<boolean>;

  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  loading;
  query = null;
  state: IState = state;
  permissionType = permissionType;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public el: ElementRef, public session: CPSession) {
    super();
    this.privileges = permissions;
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (event.target.contains(this.el.nativeElement)) {
      this.emitAndClose();
    }
  }

  onCheckedItem(checked, store) {
    this.updateItem(store.id, 'checked', checked);

    if (this.privilegeType === CP_PRIVILEGES_MAP.clubs) {
      const schoolAccess = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.clubs);
      const storeLevelAccess = canStoreReadAndWriteResource(
        this.session.g,
        store.id,
        this.privilegeType
      );

      const canWrite = schoolAccess || storeLevelAccess;

      this.updateItem(
        store.id,
        'type',
        canWrite ? permissionType.write : permissionType.read,
        canWrite ? permissionIcon.write : permissionIcon.read
      );
    } else {
      this.updateItem(store.id, 'type', permissionType.write, permissionIcon.write);
    }
  }

  updateItem(id: number, key: string, value: any, icon = null) {
    const _state = Object.assign({}, this.state);

    _state.selected.forEach((store) => {
      if (store.id === id) {
        store[key] = value;

        if (icon) {
          store['icon'] = icon;
        }
      }
    });
  }

  removeSelectedItem(service) {
    this.updateItem(service.id, 'checked', false);
  }

  emitAndClose() {
    this.cancel.emit();
  }

  onSubmit() {
    const _item = {};
    const _state = [...this.state.selected];

    _state.map((item) => {
      if (item.checked) {
        _item['store_id' in item.data ? item.data.store_id : item.data.id] = {
          [this.privilegeType]: {
            r: true,
            w: item.type === permissionType.write
          },
          [CP_PRIVILEGES_MAP.events]: {
            r: true,
            w: true
          },
          [CP_PRIVILEGES_MAP.event_attendance]: {
            r: true,
            w: true
          }
        };
      }
    });

    this.submit.emit(_item);
  }

  updateState(items) {
    this.state = {
      ...this.state,
      selected: items.map((item) => {
        return {
          id: item.id,
          type: permissionType.read, // default permission type
          checked: item.checked || false,
          data: item
        };
      })
    };
  }

  doReset() {
    this.state = {
      ...this.state,
      selected: this.state.selected.map((item) => {
        return {
          ...item,
          checked: false
        };
      })
    };
  }

  ngOnInit() {
    this.reset.pipe(takeUntil(this.destroy$)).subscribe((reset) => {
      if (reset) {
        this.doReset();
      }
    });

    this.data.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.loading = !('data' in res);

      if (res.data) {
        this.updateState(res.data);
      }

      if (res.selected) {
        for (const store in res.selected) {
          if (store in res.selected) {
            const canAccountWrite = _get(res.selected[store], 'write', true);

            const value = canAccountWrite ? permissionType.write : permissionType.read;
            const icon =
              value === permissionType.write ? permissionIcon.write : permissionIcon.read;

            this.updateItem(res.selected[store].id, 'type', value, icon);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
