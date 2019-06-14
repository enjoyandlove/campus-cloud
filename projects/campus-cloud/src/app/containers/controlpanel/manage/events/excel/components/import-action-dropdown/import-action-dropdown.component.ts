import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { CPSession, ISchool } from '@campus-cloud/session';
import { EventAttendance } from '../../../event.status';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { EventUtilService } from '../../../events.utils.service';
import { AdminService, CPI18nService, StoreService, IAdmin } from '@campus-cloud/shared/services';

interface IState {
  store_id: any;
  has_checkout: any;
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
  checkInOptions;
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
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search);

    super.fetchData(stores$).then((res) => (this.stores = res.data));
  }

  onHostSelected(store_id) {
    this.selectedHost$.next(store_id.value);

    this.state = {
      ...this.state,
      store_id
    };
  }

  getManagersByHostId(storeId) {
    const search: HttpParams = new HttpParams()
      .append('school_id', this.school.id.toString())
      .append('store_id', storeId)
      .append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    return this.adminService.getAdminByStoreId(search).pipe(
      startWith([{ label: '---' }]),
      map((admins: IAdmin[]) => {
        const _admins = [
          {
            label: '---',
            value: null
          }
        ];
        admins.forEach((admin: IAdmin) => {
          _admins.push({
            label: `${admin.firstname} ${admin.lastname}`,
            value: admin.id
          });
        });

        return _admins;
      })
    );
  }

  updateCheckInOption(item) {
    const event_attendance =
      item.action !== null ? EventAttendance.enabled : EventAttendance.disabled;

    this.state = {
      ...this.state,
      event_attendance,
      has_checkout: item
    };

    return;
  }

  updateEventManager(event_manager_id) {
    this.state = {
      ...this.state,
      event_manager_id
    };

    return;
  }

  updateAttendanceManager(attendance_manager_email) {
    this.state = {
      ...this.state,
      attendance_manager_email
    };

    return;
  }

  updateAttendanceFeedback(event_feedback) {
    this.state = {
      ...this.state,
      event_feedback
    };

    return;
  }

  defaultState() {
    this.state = {
      ...this.state,
      event_manager_id: null,
      attendance_manager_email: null,
      has_checkout: this.checkInOptions[0],
      event_attendance: EventAttendance.disabled,
      event_feedback: this.eventAttendanceFeedback[1]
    };
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
    this.managers$ = this.selectedHost$.asObservable().pipe(
      flatMap((host) => {
        if (host) {
          return this.getManagersByHostId(host);
        }

        return observableOf([{ label: '---' }]);
      })
    );
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
      this.updateManagersByStoreOrClubId(this.storeId);
    }

    if (this.isClub) {
      this.updateManagersByStoreOrClubId(this.clubId);
    }

    if (this.isOrientation) {
      this.updateManagersByStoreOrClubId(null);
    }

    if (!this.isClub && !this.isService && !this.isOrientation) {
      this.fetch();
      this.listenForHostChanges();
    } else {
      this.loading = false;
    }

    const attendanceTypeOptions = [
      {
        action: null,
        label: this.cpI18n.translate('t_events_assessment_no_check_in')
      }
    ];

    this.eventAttendanceFeedback = this.utils.getAttendanceFeedback();

    this.checkInOptions = [...attendanceTypeOptions, ...this.utils.getAttendanceTypeOptions()];

    this.state = {
      store_id: null,
      event_manager_id: null,
      attendance_manager_email: null,
      has_checkout: this.checkInOptions[0],
      event_attendance: EventAttendance.disabled,
      event_feedback: this.eventAttendanceFeedback[1]
    };
  }
}
