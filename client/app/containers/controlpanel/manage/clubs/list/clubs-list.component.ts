import { Component, Input, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { IClub } from '../club.interface';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { isClubAthletic } from '../clubs.athletics.labels';
import { ManageHeaderService } from './../../utils/header';
import { ClubStatus, ClubSocialGroup } from '../club.status';
import { CPI18nService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
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

  loading;
  clubStatus;
  deleteClub = '';
  state: IState = state;
  ACTIVE_STATUS = ClubStatus.active;
  PENDING_STATUS = ClubStatus.pending;
  disabledWall = ClubSocialGroup.disabled;
  defaultImage = require('public/default/user.png');

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private clubsService: ClubsService,
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
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());
    search.append('status', this.state.type);
    search.append('search_str', this.state.query);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('category_id', this.isAthletic.toString());

    super
      .fetchData(this.clubsService.getClubs(search, this.startRange, this.endRange))
      .then((res) => (this.state = Object.assign({}, this.state, { clubs: res.data })))
      .catch((_) => null);
  }

  onApproveClub(clubId: number) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    if (this.isAthletic === isClubAthletic.athletic) {
      search.append('category_id', isClubAthletic.athletic.toString());
    }

    this.clubsService.updateClub({ status: this.ACTIVE_STATUS }, clubId, search).subscribe(
      (updatedClub) => {
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

  doFilter(filter) {
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
    this.fetch();

    this.clubStatus = {
      [ClubStatus.inactive]: this.cpI18n.translate('clubs_inactive'),
      [ClubStatus.active]: this.cpI18n.translate('active'),
      [ClubStatus.pending]: this.cpI18n.translate('pending')
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }
}
