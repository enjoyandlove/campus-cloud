import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { ManageHeaderService } from './../../utils/header';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

interface IState {
  clubs: Array<any>;
  query: string;
  type: string;
}

const state: IState = {
  clubs: [],
  query: null,
  type: null
};

@Component({
  selector: 'cp-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss']
})
export class ClubsListComponent extends BaseComponent implements OnInit {
  loading;
  clubStatus;
  deleteClub = '';
  ACTIVE_STATUS = 1;
  PENDING_STATUS = -2;
  state: IState = state;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private clubsService: ClubsService,
    private headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());
    search.append('status', this.state.type);
    search.append('search_str', this.state.query);

    super
      .fetchData(this.clubsService.getClubs(search, this.startRange, this.endRange))
      .then(res => {
        this.state = Object.assign({}, this.state, { clubs: res.data });
      })
      .catch(_ => null);
  }

  onApproveClub(clubId: number) {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .clubsService
      .updateClub({ status: this.ACTIVE_STATUS }, clubId, search)
      .subscribe(
      res => {
        let _state = Object.assign({}, this.state, {
          clubs: this.state.clubs.map(_club => {
            if (_club.id === res.id) {
              return _club = res;
            }
            return _club;
          })
        });

        this.state = Object.assign({}, this.state, _state);
      },
      err => { throw new Error(err) }
      );
  }

  doFilter(filter) {
    this.state = Object.assign({}, this.state, {
      query: filter.query,
      type: filter.type
    });

    this.fetch();
  }

  onDeletedClub(clubId) {
    this.state = Object.assign(
      {},
      this.state,
      { clubs: this.state.clubs.filter(club => club.id !== clubId) }
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

  ngOnInit() {
    this.clubStatus = {
      0: 'Inactive',
      1: 'Active',
      '-2': 'Pending'
    };

    this
      .store
      .dispatch({
        type: HEADER_UPDATE,
        payload: this.headerService.filterByPrivileges()
      });
  }
}
