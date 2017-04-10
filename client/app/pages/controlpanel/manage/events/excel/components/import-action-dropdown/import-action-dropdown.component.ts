import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { StoreService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';

interface IState {
  store_id: any;
  event_manager_id: any;
  event_attendance: number;
  attendance_manager_email: string;
  event_feedback: any;
}

@Component({
  selector: 'cp-import-action-dropdown',
  templateUrl: './import-action-dropdown.component.html',
  styleUrls: ['./import-action-dropdown.component.scss']
})
export class EventsImportActionDropdownComponent extends BaseComponent implements OnInit {
  @Output() bulkAction: EventEmitter<IState> = new EventEmitter();
  stores;
  loading;
  managers$;
  id1 = 'id1';
  id2 = 'id2';
  eventManagers;
  isOpen = false;
  state: IState;
  eventAttendanceFeedback;
  selectedHost: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    private storeService: StoreService
  ) {
    super();
    this.fetch();
    super.isLoading().subscribe(res => this.loading = res);

    /**
     * we subscribe to the onChange of the host
     * dropdown, upon change we call the managers endpoint
     * and update the available managers
     */

    this.managers$ =
      this
        .selectedHost
        .flatMap(host => {
          console.log('running', host);
          return this.getManagersByHostId(host);
        }).startWith([
          {
            'label': '---',
            'action': null
          }
        ]);
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'Host Name',
          'action': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => {
        this.stores = res.data;
      })
      .catch(err => console.error(err));
  }

  onHostSelected(store_id) {
    this.selectedHost.next(store_id.action);

    this.state = Object.assign(
      {},
      this.state,
      { store_id }
    );
  }

  getManagersByHostId(hostId) {
    let promise = new Promise(resolve => {
      setTimeout(() => {
        resolve(this.eventManagers.filter(manager => manager.host_id === hostId));
      }, 1000);
    });
    return Observable.fromPromise(promise);
  }

  toggleEventAttendance() {
    let value = this.state.event_attendance === 0 ? 1 : 0;

    this.state = Object.assign(
      {},
      this.state,
      { event_attendance: value }
    );
    return;
  }

  updateEventManager(manager) {
    this.state = Object.assign(
      {},
      this.state,
      { event_manager_id: manager });
    return;
  }

  updateAttendanceManager(manager) {
    this.state = Object.assign(
      {},
      this.state,
      { attendance_manager_email: manager });
    return;
  }

  updateAttendanceFeedback(feedback) {
    this.state = Object.assign(
      {},
      this.state,
      { event_feedback: feedback });
    return;
  }

  defaultState() {
    this.state = Object.assign(
      {},
      this.state,
      {
        event_feedback: this.eventAttendanceFeedback[1],
        event_attendance: 0,
        event_manager_id: null,
        attendance_manager_email: null,
      }
    );
  }

  doSubmit() {
    if (this.state.event_attendance === 0) {
      this.defaultState();
    }

    this.bulkAction.emit(this.state);
    this.isOpen = false;
  }

  ngOnInit() {
    this.eventAttendanceFeedback = [
      {
        'label': 'Enabled',
        'event': 1
      },
      {
        'label': 'Disabled',
        'event': 0
      }
    ];

    this.eventManagers = [
      {
        'host_id': 28819,
        'label': 'Dummy',
        'event': 16776
      },
      {
        'host_id': 2756,
        'label': 'Hello',
        'event': 16776
      }
    ];

    this.state = {
      store_id: null,
      event_attendance: 0,
      event_manager_id: {
        'label': '',
        'action': null
      },
      attendance_manager_email: null,
      event_feedback: this.eventAttendanceFeedback[1]
    };
  }
}
