import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { OverlayRef } from '@angular/cdk/overlay';

import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { FORMAT } from '@shared/pipes/date';
import { CP_TRACK_TO } from '@shared/directives';
import { ManageHeaderService } from '../../utils';
import { amplitudeEvents } from '@shared/constants';
import { ProgramDuration } from '../orientation.status';
import { OrientationService } from '../orientation.services';
import { OrientationProgramDeleteComponent } from '../delete';
import { CPI18nService, CPTrackingService, ModalService } from '@shared/services';

@Component({
  selector: 'cp-list-orientation',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrientationListComponent extends BaseComponent implements OnInit {
  label;
  loading;
  eventData;
  noDuration;
  activeModal: OverlayRef;
  selectedProgram = null;
  launchCreateModal = false;
  launchDuplicateModal = false;
  dateFormat = FORMAT.SHORT;

  state = {
    orientationPrograms: [],
    search_str: null,
    sort_field: 'name',
    sort_direction: 'asc'
  };

  constructor(
    public el: ElementRef,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private modalService: ModalService,
    public service: OrientationService,
    public cpTracking: CPTrackingService,
    public headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onClickDuplicate(program) {
    this.selectedProgram = program;
    this.launchDuplicateModal = true;
  }

  onClickDelete(program) {
    this.activeModal = this.modalService.open(
      OrientationProgramDeleteComponent,
      {},
      {
        data: program,
        onClose: this.onDeleteTearDown.bind(this)
      }
    );
  }

  closeActiveModal() {
    this.modalService.close(this.activeModal);
    this.activeModal = null;
  }

  onDeleteTearDown(programId?: number) {
    if (programId) {
      this.state = {
        ...this.state,
        orientationPrograms: this.state.orientationPrograms.filter((p) => p.id !== programId)
      };

      if (this.state.orientationPrograms.length === 0 && this.pageNumber > 1) {
        this.resetPagination();
        this.fetch();
      }
    }

    this.closeActiveModal();
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#programCreate').modal();
      },

      1
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

  public fetch() {
    const search = new HttpParams()
      .set('search_str', this.state.search_str)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getPrograms(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, orientationPrograms: res.data }));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  ngOnInit() {
    this.noDuration = ProgramDuration.disabled;
    this.headerService.updateHeader();
    this.fetch();
    this.label = {
      name: this.cpI18n.translate('name')
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
