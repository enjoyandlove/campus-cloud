import { HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Observable } from 'rxjs';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import {
  canAccountLevelWriteResource,
  canSchoolWriteResource
} from './../../../../../../../shared/utils/privileges/privileges';
import { DATE_FILTER } from './events-filters';
import { CPSession } from '../../../../../../../session';
import { EventAttendance } from '../../../event.status';
import { CPDate } from '../../../../../../../shared/utils/date';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { CPTrackingService, RouteLevel, StoreService } from '../../../../../../../shared/services';

interface IState {
  end: number;
  start: number;
  store_id: number;
  upcoming: boolean;
  search_str: string;
  attendance_only: number;
}

@Component({
  selector: 'cp-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class ListActionBoxComponent implements OnInit {
  @Input() isSimple: boolean;
  @Input() isOrientation: boolean;
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  hosts;
  eventData;
  isCalendar;
  eventFilter;
  dateFilterOpts;
  canCreateEvent;
  threeYearsFromNow = CPDate.now(this.session.tz)
    .add(3, 'years')
    .unix();
  isFilteredByDate;
  state: IState = {
    upcoming: true,
    search_str: null,
    store_id: null, // all stores
    attendance_only: EventAttendance.disabled,
    start: CPDate.now(this.session.tz).unix(),
    end: this.threeYearsFromNow
  };
  stores$: Observable<any>;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private storeService: StoreService,
    private cpTracking: CPTrackingService
  ) {}

  getStores() {
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target) || event.target.nodeName !== 'svg') {
      if (this.isCalendar) {
        this.isCalendar = false;
      }
    }
  }

  onToggleCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendar = !this.isCalendar;
  }

  onDateReset() {
    this.isCalendar = false;

    this.resetDateRange();

    this.listAction.emit(this.state);
  }

  private resetDateRange() {
    const now = CPDate.now(this.session.tz).unix();
    this.isFilteredByDate = false;

    if (this.state.upcoming) {
      this.state = Object.assign({}, this.state, {
        start: now,
        end: this.threeYearsFromNow
      });

      this.dateFilterOpts = Object.assign({}, this.dateFilterOpts, {
        minDate: CPDate.now(this.session.tz).format(),
        maxDate: null
      });

      return;
    }

    this.state = Object.assign({}, this.state, {
      start: 0,
      end: now
    });

    this.dateFilterOpts = Object.assign({}, this.dateFilterOpts, {
      minDate: null,
      maxDate: CPDate.now(this.session.tz).format()
    });
  }

  onSearch(search_str): void {
    this.state = Object.assign({}, this.state, { search_str });

    this.listAction.emit(this.state);
  }

  onFilterByHost(store_id): void {
    store_id = 0 ? null : store_id;

    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  onEventDate(upcoming) {
    this.state = Object.assign({}, this.state, { upcoming });

    this.resetDateRange();

    this.listAction.emit(this.state);
  }

  onDateRange(dates) {
    this.isFilteredByDate = true;

    this.state = Object.assign({}, this.state, {
      start: CPDate.toEpoch(dates[0], this.session.tz),
      end: CPDate.toEpoch(dates[1], this.session.tz)
    });

    this.listAction.emit(this.state);
  }

  onAttendanceToggle(checked) {
    const attendance_only = checked ? EventAttendance.enabled : EventAttendance.disabled;

    this.state = Object.assign({}, this.state, { attendance_only });

    this.listAction.emit(this.state);
  }

  launchModal() {
    $('#excelEventsModal').modal();
  }

  ngOnInit() {
    const eventName = this.isSimple
      ? amplitudeEvents.CLICKED_CHANGE_BUTTON
      : amplitudeEvents.CLICKED_CREATE_ITEM;

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };

    this.getStores();
    const canSchoolWrite = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const canAccountWrite = canAccountLevelWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);

    this.canCreateEvent = canSchoolWrite || canAccountWrite || this.isOrientation;

    this.eventFilter = DATE_FILTER;

    this.dateFilterOpts = {
      utc: true,
      inline: true,
      mode: 'range',
      minDate: CPDate.now(this.session.tz).format(),
      maxDate: null
    };

    this.listAction.emit(this.state);
  }
}
