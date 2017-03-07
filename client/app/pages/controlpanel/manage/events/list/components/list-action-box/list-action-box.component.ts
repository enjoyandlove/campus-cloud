import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { CPDate } from '../../../../../../../shared/utils/date';
import { BUTTON_DROPDOWN, DATE_FILTER } from './events-filters';
import { StoreService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';
import {
  BUTTON_ALIGN,
  BUTTON_THEME
} from '../../../../../../../shared/components/cp-button-dropdown';

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
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  hosts;
  loading;
  eventFilter;
  buttonDropdown;
  dateFilterOpts;
  state: IState = state;
  buttonDropdownOptions;

  constructor(
    private router: Router,
    private storeService: StoreService
  ) {
    super();
    this.fetch();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    const stores$ = this.storeService.getStores().map(res => {
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
        this.hosts = res;
        this.listAction.emit(this.state);
      })
      .catch(err => console.error(err));
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

  onButtonDropdown(event) {
    switch (event) {
      case 'facebook':
        this.router.navigate(['/manage/events/import/facebook']);
        break;
      case 'excel':
        // TODO Avoid this...
        $('#excelEventsModal').modal();
        break;
    }
  }

  ngOnInit() {
    this.eventFilter = DATE_FILTER;
    this.buttonDropdown = BUTTON_DROPDOWN;

    this.dateFilterOpts = {
      utc: true,
      inline: true,
      mode: 'range',
      minDate: new Date(),
      maxDate: null
    };

    this.buttonDropdownOptions = {
      align: BUTTON_ALIGN.RIGHT,
      theme: BUTTON_THEME.PRIMARY
    };
  }
}
