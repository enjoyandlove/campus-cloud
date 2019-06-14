import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { IEmployer } from '../employer.interface';
import { CPSession } from '../../../../../../session';
import { EmployerService } from '../employer.service';
import { BaseComponent } from '../../../../../../base';
import { baseActions, IHeader } from '../../../../../../store/base';
import { CP_TRACK_TO } from '../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';

export interface IState {
  employers: Array<IEmployer>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state = {
  employers: [],
  search_str: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss']
})
export class EmployerListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  sortingLabels;
  deleteEmployer;
  selectedEmployer;
  state: IState = state;
  launchDeleteModal = false;
  launchCreateModal = false;
  launchEditModal = false;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: EmployerService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#createModal').modal();
      },

      1
    );
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onCreated(newEmployer: IEmployer): void {
    this.launchCreateModal = false;
    this.state.employers = [newEmployer, ...this.state.employers];
  }

  onEdited(editEmployer: IEmployer) {
    this.launchEditModal = false;
    this.selectedEmployer = null;

    this.state = Object.assign({}, this.state, {
      employers: this.state.employers.map((employer) =>
        employer.id === editEmployer.id ? editEmployer : employer
      )
    });
  }

  onDeleted(id: number) {
    this.deleteEmployer = null;
    this.state = Object.assign({}, this.state, {
      employers: this.state.employers.filter((employer) => employer.id !== id)
    });

    if (this.state.employers.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  public fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getEmployers(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, employers: res.data }));
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `employers_manage_employer`,
        subheading: null,
        em: null,
        crumbs: {
          label: 'jobs',
          url: 'jobs'
        },
        children: []
      }
    });
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };

    this.fetch();
    this.buildHeader();

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };
  }
}
