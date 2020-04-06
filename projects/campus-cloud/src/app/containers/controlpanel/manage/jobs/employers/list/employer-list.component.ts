import { ModalService } from '@ready-education/ready-ui/overlays/modal/modal.service';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';

import { IEmployer } from '../employer.interface';
import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { EmployerService } from '../employer.service';
import { baseActions, IHeader } from '@campus-cloud/store';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { EmployerEditComponent } from '@controlpanel/manage/jobs/employers/edit';
import { EmployerCreateComponent } from '@controlpanel/manage/jobs/employers/create';
import { EmployerDeleteComponent } from '@controlpanel/manage/jobs/employers/delete';

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
  styleUrls: ['./employer-list.component.scss'],
  providers: [ModalService]
})
export class EmployerListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  modal: OverlayRef;
  state: IState = state;

  constructor(
    public session: CPSession,
    public store: Store<IHeader>,
    public service: EmployerService,
    private modalService: ModalService,
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
    this.modal = this.modalService.open(EmployerCreateComponent, {
      onClose: this.resetModal.bind(this),
      onAction: this.onCreated.bind(this)
    });
  }

  resetModal() {
    this.modal.dispose();
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
    this.state.employers = [newEmployer, ...this.state.employers];
  }

  onEdit(employer: IEmployer) {
    this.modal = this.modalService.open(EmployerEditComponent, {
      data: employer,
      onAction: this.onEdited.bind(this),
      onClose: this.resetModal.bind(this)
    });
  }

  onEdited(editEmployer: IEmployer) {
    this.state = {
      ...this.state,
      employers: this.state.employers.map((employer) =>
        employer.id === editEmployer.id ? editEmployer : employer
      )
    };
  }

  onDelete(employer: IEmployer) {
    this.modal = this.modalService.open(EmployerDeleteComponent, {
      data: employer,
      onAction: this.onDeleted.bind(this),
      onClose: this.resetModal.bind(this)
    });
  }

  onDeleted(id: number) {
    this.state = {
      ...this.state,
      employers: this.state.employers.filter((employer) => employer.id !== id)
    };

    if (this.state.employers.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }

    this.resetModal();
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
    Promise.resolve().then(() => {
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
    });
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    delete eventProperties['page_name'];
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };

    this.fetch();
    this.buildHeader();
  }
}
