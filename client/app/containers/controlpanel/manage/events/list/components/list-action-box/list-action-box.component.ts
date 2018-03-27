import {
  OnInit,
  Output,
  Input,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { URLSearchParams } from '@angular/http';

import {
  canSchoolWriteResource,
  canAccountLevelWriteResource
} from './../../../../../../../shared/utils/privileges/privileges';

import { Observable } from 'rxjs/Observable';
import { DATE_FILTER } from './events-filters';
import { EventAttendance } from '../../../event.status';
import { CPSession } from '../../../../../../../session';
import { CPDate } from '../../../../../../../shared/utils/date';
import { StoreService } from '../../../../../../../shared/services';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';

interface IState {
  end: number;
  start: number;
  store_id: number;
  upcoming: boolean;
  search_str: string;
  attendance_only: number;
}

const threeYearsFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 3));

@Component({
  selector: 'cp-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class ListActionBoxComponent implements OnInit {
  @Input() isSimple: boolean;
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  hosts;
  isCalendar;
  eventFilter;
  dateFilterOpts;
  canCreateEvent;
  isFilteredByDate;
  state: IState = {
    upcoming: true,
    search_str: null,
    store_id: null, // all stores
    attendance_only: EventAttendance.disabled,
    start: CPDate.toEpoch(new Date(), this.session.tz),
    end: CPDate.toEpoch(threeYearsFromNow, this.session.tz)
  };
  stores$: Observable<any>;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private storeService: StoreService
  ) {}

  getStores() {
    const school = this.session.g.get('school');
    const search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

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
    this.isFilteredByDate = false;

    if (this.state.upcoming) {
      this.state = Object.assign({}, this.state, {
        start: CPDate.toEpoch(new Date(), this.session.tz),
        end: CPDate.toEpoch(threeYearsFromNow, this.session.tz)
      });

      this.dateFilterOpts = Object.assign({}, this.dateFilterOpts, {
        minDate: new Date(),
        maxDate: null
      });

      return;
    }

    this.state = Object.assign({}, this.state, {
      start: 0,
      end: CPDate.toEpoch(new Date(), this.session.tz)
    });

    this.dateFilterOpts = Object.assign({}, this.dateFilterOpts, {
      minDate: null,
      maxDate: new Date()
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
    this.getStores();
    const canSchoolWrite = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const canAccountWrite = canAccountLevelWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);

    this.canCreateEvent = canSchoolWrite || canAccountWrite;

    this.eventFilter = DATE_FILTER;

    this.dateFilterOpts = {
      utc: true,
      inline: true,
      mode: 'range',
      minDate: new Date(),
      maxDate: null
    };

    this.listAction.emit(this.state);
  }
}
