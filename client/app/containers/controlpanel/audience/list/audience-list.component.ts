import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../session';
import { AudienceService } from '../audience.service';
import { BaseComponent } from '../../../../base/base.component';
import { CPI18nService } from '../../../../shared/services/index';
import { createSpreadSheet } from './../../../../shared/utils/csv/parser';

interface IState {
  audiences: Array<any>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  audiences: [],
  search_str: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-audience-list',
  templateUrl: './audience-list.component.html',
  styleUrls: ['./audience-list.component.scss']
})
export class AudienceListComponent extends BaseComponent implements OnInit {
  loading;
  audienceUsers;
  isAudienceEdit;
  isAudienceDelete;
  isAudienceImport;
  isAudienceCreate;
  state: IState = state;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private service: AudienceService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

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

  downloadAudience(audience) {
    const columns = [
      this.cpI18n.translate('first_name'),
      this.cpI18n.translate('last_name'),
      this.cpI18n.translate('email')
    ];

    const data = audience.users.map((user) => {
      return {
        [this.cpI18n.translate('first_name')]: user.firstname,
        [this.cpI18n.translate('last_name')]: user.lastname,
        [this.cpI18n.translate('email')]: user.email
      };
    });

    createSpreadSheet(data, columns, `${audience.name}`);
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getAudiences(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then((res) => (this.state = Object.assign({}, this.state, { audiences: res.data })));
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });
    this.resetPagination();

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

  onResetCreateAudience() {
    this.audienceUsers = [];
    this.isAudienceCreate = false;
  }

  onCreatedAudience() {
    this.fetch();
  }

  onLaunchCreateModal(users?: Array<any>) {
    this.isAudienceCreate = true;
    this.audienceUsers = users ? users : null;
    setTimeout(
      () => {
        $('#audienceCreate').modal();
      },

      1
    );
  }

  onLaunchImportModal() {
    this.isAudienceImport = true;
    setTimeout(
      () => {
        $('#audienceImport').modal();
      },

      1
    );
  }

  onEditedAudience() {
    this.fetch();
  }

  onDeletedAudience(audienceId: number) {
    this.isAudienceDelete = false;
    const _state = Object.assign({}, this.state);

    _state.audiences = _state.audiences.filter((audience) => {
      if (audience.id !== audienceId) {
        return audience;
      }

      return;
    });

    this.state = Object.assign({}, this.state, { audiences: _state.audiences });

    if (this.state.audiences.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {}
}
