import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';

import { IEmployer } from '../employer.interface';
import { CPSession } from '../../../../../../session';
import { EmployerService } from '../employer.service';
import { BaseComponent } from '../../../../../../base';
import { CPI18nService } from '../../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../../reducers/header.reducer';

export interface IState {
  employers: any[];
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
    public service: EmployerService
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
      employers: this.state.employers.map(
        (employer) => (employer.id === editEmployer.id ? editEmployer : employer)
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
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getEmployers(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, employers: res.data }));
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
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
    this.fetch();
    this.buildHeader();
  }
}
