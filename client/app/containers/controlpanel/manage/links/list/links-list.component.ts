import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromLinks from '@app/store/manage/links';
import { BaseComponent } from '@app/base/base.component';
import { CP_TRACK_TO } from '@shared/directives/tracking';
import { amplitudeEvents } from '@shared/constants/analytics';
import { environment } from '@client/environments/environment';
import * as selectors from '@app/store/manage/manage.selectors';
import { CPI18nService, CPTrackingService } from '@shared/services';

@Component({
  selector: 'cp-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss']
})
export class LinksListComponent extends BaseComponent implements OnInit {
  pageNext;
  pagePrev;
  eventData;
  pageNumber;
  isLinksEdit;
  sortingLabels;
  editLink = '';
  isLinksDelete;
  isLinksCreate;
  loading = true;
  deleteLink = '';
  state: fromLinks.ILinksState;
  defaultImage = `${environment.root}public/default/user.png`;

  constructor(
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
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
    this.isLinksCreate = true;

    setTimeout(
      () => {
        $('#linksCreate').modal();
      },

      1
    );
  }

  onCreatedLink() {
    this.isLinksCreate = false;
  }

  onEditedLink() {
    this.isLinksEdit = false;
  }

  onDeletedLink() {
    this.isLinksDelete = false;

    if (this.state.links.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
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
