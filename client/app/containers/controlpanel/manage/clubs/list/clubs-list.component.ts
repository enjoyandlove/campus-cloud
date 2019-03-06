import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayRef } from '@angular/cdk/overlay';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import { IClub } from '../club.interface';
import { baseActions } from '@app/store/base';
import { ClubsService } from '../clubs.service';
import { ClubsDeleteComponent } from '../delete';
import { amplitudeEvents } from '@shared/constants';
import { BaseComponent } from '@app/base/base.component';
import { CP_TRACK_TO } from '@shared/directives/tracking';
import { ManageHeaderService } from './../../utils/header';
import { ClubsUtilsService } from '../clubs.utils.service';
import { ClubSocialGroup, ClubStatus } from '../club.status';
import { environment } from '@client/environments/environment';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { CPI18nService, CPTrackingService, ModalService } from '@shared/services';

interface IState {
  clubs: IClub[];
  query: string;
  type: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  clubs: [],
  query: null,
  type: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss']
})
export class ClubsListComponent extends BaseComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  label;
  loading;
  eventData;
  clubStatus;
  sortingLabels;
  activeModal: OverlayRef;
  state: IState = state;
  ACTIVE_STATUS = ClubStatus.active;
  PENDING_STATUS = ClubStatus.pending;
  disabledWall = ClubSocialGroup.disabled;
  defaultImage = `${environment.root}public/default/user.png`;

  eventProperties = {
    club_id: null,
    club_type: null
  };

  constructor(
    public router: Router,
    private store: Store<any>,
    private session: CPSession,
    public route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private utils: ClubsUtilsService,
    private clubsService: ClubsService,
    private modalService: ModalService,
    private cpTracking: CPTrackingService,
    private headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  private fetch() {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('status', this.state.type)
      .append('search_str', this.state.query)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('category_id', this.isAthletic.toString());

    super
      .fetchData(this.clubsService.getClubs(search, this.startRange, this.endRange))
      .then((res) => {
        this.state = Object.assign({}, this.state, { clubs: res.data });
      })
      .catch((_) => null);
  }

  onApproveClub(clubId: number) {
    let search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    if (this.isAthletic === isClubAthletic.athletic) {
      search = search.append('category_id', isClubAthletic.athletic.toString());
    }

    this.clubsService.updateClub({ status: this.ACTIVE_STATUS }, clubId, search).subscribe(
      (updatedClub: any) => {
        this.trackEvent(updatedClub);
        this.state = {
          ...this.state,
          clubs: this.state.clubs.map(
            (oldClub) => (oldClub.id === updatedClub.id ? updatedClub : oldClub)
          )
        };
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  onDelete(club) {
    this.activeModal = this.modalService.open(
      ClubsDeleteComponent,
      {},
      {
        data: {
          club,
          isAthletic: this.isAthletic
        },
        onClose: this.onDeletedClub.bind(this)
      }
    );
  }

  onDeletedClub(clubId?: number) {
    if (clubId) {
      this.state = {
        ...this.state,
        clubs: this.state.clubs.filter((club) => club.id !== clubId)
      };

      if (this.state.clubs.length === 0 && this.pageNumber > 1) {
        this.resetPagination();
        this.fetch();
      }
    }

    this.modalService.close(this.activeModal);
    this.activeModal = null;
  }

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      club_id: res.id,
      club_type: this.utils.capitalizeFirstLetter(this.label.club_athletic)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_APPROVED_CLUB, this.eventProperties);
  }

  doFilter(filter) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        type: filter.type
      }
    });

    this.state = Object.assign({}, this.state, {
      query: filter.query,
      type: filter.type
    });

    if (filter.query) {
      this.resetPagination();
    }

    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  onError(body) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.label = clubAthleticLabels(this.isAthletic);

    this.clubStatus = {
      [ClubStatus.inactive]: this.cpI18n.translate('clubs_inactive'),
      [ClubStatus.active]: this.cpI18n.translate('active'),
      [ClubStatus.pending]: this.cpI18n.translate('pending')
    };

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };

    const hasTypeParam = this.route.snapshot.queryParamMap.get('type');

    if (!hasTypeParam) {
      this.fetch();
    }
  }
}
