import { Component, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';

import { ManageHeaderService } from '../../utils';
import * as fromLinks from '@app/store/manage/links';
import { BaseComponent } from '@app/base/base.component';
import { CP_TRACK_TO } from '@shared/directives/tracking';
import { amplitudeEvents } from '@shared/constants/analytics';
import { environment } from '@campus-cloud/environments/environment';
import * as selectors from '@app/store/manage/manage.selectors';
import { LinksEditComponent } from './../edit/links-edit.component';
import { LinksDeleteComponent } from './../delete/links-delete.component';
import { LinksCreateComponent } from './../create/links-create.component';
import { ILink } from '@app/containers/controlpanel/manage/links/link.interface';
import { CPI18nService, CPTrackingService, ModalService } from '@shared/services';

@Component({
  selector: 'cp-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss'],
  providers: [ModalService]
})
export class LinksListComponent extends BaseComponent implements OnInit {
  pageNext;
  pagePrev;
  eventData;
  pageNumber;
  sortingLabels;
  loading = true;
  modal: OverlayRef;
  state: fromLinks.ILinksState;
  defaultImage = `${environment.root}assets/default/user.png`;

  constructor(
    public cpI18n: CPI18nService,
    private modalService: ModalService,
    public cpTracking: CPTrackingService,
    private headerService: ManageHeaderService,
    private store: Store<fromLinks.ILinksState>
  ) {
    super();

    this.fetch();

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();
    this.setRange();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.setRange();

    this.fetch();
  }

  onSearch(search_str) {
    this.store.dispatch(new fromLinks.SetLinksSearch(search_str));

    this.resetPagination();
    this.setRange();

    this.fetch();
  }

  doSort(sort_field) {
    this.store.dispatch(
      new fromLinks.SetLinksSort({
        sort_field,
        sort_direction: this.state.sort.sort_direction === 'asc' ? 'desc' : 'asc'
      })
    );

    this.fetch();
  }

  private fetch() {
    this.store.dispatch(new fromLinks.LoadLinks());
  }

  private setRange() {
    this.store.dispatch(
      new fromLinks.SetLinksRange({ start_range: this.startRange, end_range: this.endRange })
    );
  }

  onLaunchCreateModal() {
    this.modal = this.modalService.open(LinksCreateComponent, null, {
      onClose: this.resetModal.bind(this)
    });
  }

  onLaunchDeleteModal(link: ILink) {
    this.modal = this.modalService.open(LinksDeleteComponent, null, {
      data: link,
      onClose: this.onDeletedLink.bind(this)
    });
  }

  onDeletedLink() {
    this.resetModal();

    if (this.state.links.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  resetModal() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  onEdit(link: ILink) {
    this.modal = this.modalService.open(LinksEditComponent, null, {
      data: link,
      onClose: this.resetModal.bind(this)
    });
  }

  ngOnInit() {
    this.headerService.updateHeader();

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };

    const start_range = this.startRange;
    const end_range = this.endRange;

    this.store.dispatch(new fromLinks.SetLinksRange({ start_range, end_range }));

    this.store.select(selectors.getLinksState).subscribe((state) => {
      this.state = state;
      this.loading = false;
    });
  }
}
