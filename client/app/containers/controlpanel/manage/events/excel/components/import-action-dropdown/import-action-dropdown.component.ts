import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EventAttendance } from '../../../event.status';
import { EventUtilService } from '../../../events.utils.service';
import { CPSession, ISchool } from '../../../../../../../session';
import { BaseComponent } from '../../../../../../../base/base.component';
import { StoreService, AdminService, CPI18nService } from '../../../../../../../shared/services';

interface IState {
  store_id: any;
  event_feedback: any;
  event_manager_id: any;
  event_attendance: number;
  attendance_manager_email: string;
}

@Component({
  selector: 'cp-import-action-dropdown',
  templateUrl: './import-action-dropdown.component.html',
  styleUrls: ['./import-action-dropdown.component.scss']
})
export class EventsImportActionDropdownComponent extends BaseComponent implements OnInit {
  @Input() props: any;
  @Input() storeId: number;
  @Input() clubId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isOrientation: boolean;

  @Output() bulkAction: EventEmitter<IState> = new EventEmitter();

  stores;
  loading;
  managers$;
  id1 = 'id1';
  id2 = 'id2';
  isOpen = false;
  state: IState;
  school: ISchool;
  eventAttendanceFeedback;
  selectedHost$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: EventUtilService,
    private adminService: AdminService,
    private storeService: StoreService
  ) {
    super();
    this.fetch();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    const school = this.session.g.get('school');
    const search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search);

    super
      .fetchData(stores$)
      .then((res) => (this.stores = res.data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  onHostSelected(store_id) {
    this.selectedHost$.next(store_id.value);

    this.state = Object.assign({}, this.state, { store_id });
  }

  getManagersByHostId(storeId) {
    const search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    return this.adminService
      .getAdminByStoreId(search)
      .startWith([{ label: '---' }])
      .map((admins) => {
        const _admins = [
          {
            label: '---',
            value: null
          }
        ];
        admins.forEach((admin) => {
          _admins.push({
            label: `${admin.firstname} ${admin.lastname}`,
            value: admin.id
          });
        });

        return _admins;
      });
  }

  toggleEventAttendance() {
    const value = this.state.event_attendance === EventAttendance.disabled
      ? EventAttendance.enabled
      : EventAttendance.disabled;

    this.state = Object.assign({}, this.state, { event_attendance: value });

    return;
  }

  updateEventManager(manager) {
    this.state = Object.assign({}, this.state, { event_manager_id: manager });

    return;
  }

  updateAttendanceManager(manager) {
    this.state = Object.assign({}, this.state, {
      attendance_manager_email: manager
    });

    return;
  }

  updateAttendanceFeedback(feedback) {
    this.state = Object.assign({}, this.state, { event_feedback: feedback });

    return;
  }

  defaultState() {
    this.state = Object.assign({}, this.state, {
      event_feedback: this.eventAttendanceFeedback[1],
      event_attendance: EventAttendance.disabled,
      event_manager_id: null,
      attendance_manager_email: null
    });
  }

  updateManagersByStoreOrClubId(storeId) {
    this.managers$ = this.getManagersByHostId(storeId);
  }

  listenForHostChanges() {
    /**
     * we subscribe to the onChange of the host
     * dropdown, upon change we call the managers endpoint
     * and update the available managers
     */
    this.managers$ = this.selectedHost$.asObservable().flatMap((host) => {
      if (host) {
        return this.getManagersByHostId(host);
      }

      return Observable.of([{ label: '---' }]);
    });
  }

  doSubmit() {
    if (this.state.event_attendance === EventAttendance.disabled) {
      this.defaultState();
    }
    this.bulkAction.emit(this.state);
    this.isOpen = false;
  }

  ngOnInit() {
    if (this.isService) {
      this.updateManagersByStoreOrClubId(this.serviceId);
    }

    if (this.isClub) {
      this.updateManagersByStoreOrClubId(this.clubId);
    }

    if (this.isOrientation) {
      this.updateManagersByStoreOrClubId(null);
    }

    if (!this.isClub && !this.isService && !this.isOrientation) {
      this.listenForHostChanges();
    }

    this.eventAttendanceFeedback = [
      {
        label: this.cpI18n.translate('event_enabled'),
        event: 1
      },
      {
        label: this.cpI18n.translate('events_disabled'),
        event: 0
      }
    ];

    this.state = {
      store_id: null,
      event_attendance: EventAttendance.disabled,
      event_manager_id: null,
      attendance_manager_email: null,
      event_feedback: this.eventAttendanceFeedback[1]
    };
  }
}
