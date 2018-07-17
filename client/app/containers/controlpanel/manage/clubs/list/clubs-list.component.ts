import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IClub } from '../club.interface';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { ManageHeaderService } from './../../utils/header';
import { ClubsUtilsService } from '../clubs.utils.service';
import { ClubSocialGroup, ClubStatus } from '../club.status';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

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
  clubStatus;
  sortingLabels;
  deleteClub = '';
  state: IState = state;
  ACTIVE_STATUS = ClubStatus.active;
  PENDING_STATUS = ClubStatus.pending;
  disabledWall = ClubSocialGroup.disabled;
  defaultImage = require('public/default/user.png');

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
      .then((res) => (this.state = Object.assign({}, this.state, { clubs: res.data })))
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

  onDeletedClub(clubId) {
    this.state = Object.assign({}, this.state, {
      clubs: this.state.clubs.filter((club) => club.id !== clubId)
    });

    if (this.state.clubs.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
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
      type: SNACKBAR_SHOW,
      payload: {
        body,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  ngOnInit() {
    this.label = clubAthleticLabels(this.isAthletic);

    this.clubStatus = {
      [ClubStatus.inactive]: this.cpI18n.translate('clubs_inactive'),
      [ClubStatus.active]: this.cpI18n.translate('active'),
      [ClubStatus.pending]: this.cpI18n.translate('pending')
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };

    this.fetch();
  }
}
