import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { OrientationService } from '../orientation.services';
import { CPI18nService } from '../../../../../shared/services';
import { FORMAT } from '../../../../../shared/pipes/date/date.pipe';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-list-orientation',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class OrientationListComponent extends BaseComponent implements OnInit {

  isOpen;
  loading;
  selectedProgram = null;
  launchDeleteModal = false;
  launchCreateModal = false;
  launchDuplicateModal = false;
  dateFormat = FORMAT.SHORT;

  @Input() isOrientation = true;

  state = {
    orientationPrograms: [],
    search_str: null,
    sort_field: 'name',
    sort_direction: 'asc',
  };

  constructor(
    public el: ElementRef,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    private service: OrientationService,
    public headerService: ManageHeaderService) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.fetch();
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#programCreate').modal();
      },
      1,
    );
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges(),
    });
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getOrientationPrograms(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, orientationPrograms: res.data }))
      .catch((err) => {
        throw new Error(err);
      });
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc',
    };

    this.fetch();
  }

  // todo might be removed as we redirect to event
  onCreated(newProgram: any): void {
    this.launchCreateModal = false;
    this.state.orientationPrograms = [newProgram, ...this.state.orientationPrograms];
  }

  onDeleted(programId: number) {
    this.selectedProgram = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      orientationPrograms: this.state.orientationPrograms.filter(
        (program) => program.id !== programId,
      ),
    });

    if (this.state.orientationPrograms.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.buildHeader();
  }
}
