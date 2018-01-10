import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from '../../../../../shared/services/index';

interface IState {
  lists: Array<any>;
  search_str: string;
}

const state: IState = {
  lists: [],
  search_str: null,
};

declare var $: any;

@Component({
  selector: 'cp-lists-list',
  templateUrl: './lists-list.component.html',
  styleUrls: ['./lists-list.component.scss'],
})
export class ListsListComponent extends BaseComponent implements OnInit {
  loading;
  listUsers;
  isListsEdit;
  isListsCreate;
  isListsDelete;
  isListsImport;
  state: IState = state;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private listsService: ListsService,
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.listsService.getLists(
      search,
      this.startRange,
      this.endRange,
    );

    super
      .fetchData(stream$)
      .then(
        (res) =>
          (this.state = Object.assign({}, this.state, { lists: res.data })),
      )
      .catch((err) => {
        throw new Error(err);
      });
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

  onResetCreateList() {
    this.listUsers = [];
    this.isListsCreate = false;
  }

  onCreatedList() {
    this.fetch();
  }

  onLaunchCreateModal(users?: Array<any>) {
    this.isListsCreate = true;
    this.listUsers = users ? users : null;
    setTimeout(
      () => {
        $('#listsCreate').modal();
      },

      1,
    );
  }

  onLaunchImportModal() {
    this.isListsImport = true;
    setTimeout(
      () => {
        $('#listsImport').modal();
      },

      1,
    );
  }

  onEditedList() {
    this.fetch();
  }

  onDeletedList(listId: number) {
    this.isListsDelete = false;
    const _state = Object.assign({}, this.state);

    _state.lists = _state.lists.filter((list) => {
      if (list.id !== listId) {
        return list;
      }

      return;
    });

    this.state = Object.assign({}, this.state, { lists: _state.lists });

    if (this.state.lists.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {}
}
