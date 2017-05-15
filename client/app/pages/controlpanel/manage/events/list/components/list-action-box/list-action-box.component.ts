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

import { DATE_FILTER } from './events-filters';
import { CPSession } from '../../../../../../../session';
import { CPDate } from '../../../../../../../shared/utils/date';
import { StoreService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';

interface IState {
  end: number;
  start: number;
  store_id: number;
  upcoming: boolean;
  search_str: string;
  attendance_only: number;
}

const threeYearsFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 3));

const state = {
  upcoming: true,       // true -> upcoming false -> past
  search_str: null,
  store_id: null,       // all stores
  attendance_only: 0,
  start: CPDate.toEpoch(new Date()),
  end: CPDate.toEpoch(threeYearsFromNow)
};

declare var $: any;

@Component({
  selector: 'cp-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class ListActionBoxComponent extends BaseComponent implements OnInit {
  @Input() isSimple: boolean;
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  hosts;
  loading;
  isCalendar;
  eventFilter;
  dateFilterOpts;
  state: IState = state;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private storeService: StoreService
  ) {
    super();
    this.fetch();
    super.isLoading().subscribe(res => this.loading = res);
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target) || (event.target.nodeName !== 'svg')) {
      if (this.isCalendar) {
        this.isCalendar = false;
      }
    }
  }

  onToggleCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendar = !this.isCalendar;
  }

  private fetch() {
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search).map(res => {
      const stores = [
        {
          'label': 'All Host',
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
        this.hosts = res.data;
        this.listAction.emit(this.state);
      })
      .catch(_ => {});
  }

  private resetDateRange() {
    if (this.state.upcoming) {
      this.state = Object.assign({}, this.state,
        { start: CPDate.toEpoch(new Date()), end: CPDate.toEpoch(threeYearsFromNow) });

      this.dateFilterOpts = Object.assign({},
        this.dateFilterOpts, { minDate: new Date(), maxDate: null }
      );
      return;
    }
    this.state = Object.assign({}, this.state,
      { start: 0, end: CPDate.toEpoch(new Date()) });
    this.dateFilterOpts = Object.assign({},
      this.dateFilterOpts, { minDate: null, maxDate: new Date() }
    );
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
    this.state = Object.assign({}, this.state,
      { start: CPDate.toEpoch(dates[0]), end: CPDate.toEpoch(dates[1]) });

    this.listAction.emit(this.state);
  }

  onAttendanceToggle(attendance_only) {
    attendance_only = attendance_only ? 1 : 0;
    this.state = Object.assign({}, this.state, { attendance_only });

    this.listAction.emit(this.state);
  }

  launchModal() {
    $('#excelEventsModal').modal();
  }

  ngOnInit() {
    this.eventFilter = DATE_FILTER;

    this.dateFilterOpts = {
      utc: true,
      inline: true,
      mode: 'range',
      minDate: new Date(),
      maxDate: null
    };
  }
}
