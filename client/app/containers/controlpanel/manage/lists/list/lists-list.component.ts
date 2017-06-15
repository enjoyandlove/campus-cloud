import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';

interface IState {
  lists: Array<any>;
  search_str: string;
}

const state: IState = {
  lists: [],
  search_str: null
};

declare var $: any;

@Component({
  selector: 'cp-lists-list',
  templateUrl: './lists-list.component.html',
  styleUrls: ['./lists-list.component.scss']
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
    private listsService: ListsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.school.id.toString());

    super
      .fetchData(this.listsService.getLists(search, this.startRange, this.endRange))
      .then(res => this.state = Object.assign({}, this.state, { lists: res.data }))
      .catch(err => console.log(err));
  }

  onSearch(query) {
    console.log(query);
    this.state = Object.assign(
      {},
      this.state,
      { search_str: query }
    );

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

  onCreatedList(list) {
    list = Object.assign(
      {},
      list,
      { users: list.user_ids }
    );

    this.isListsCreate = false;
    this.state.lists = [list, ...this.state.lists];
    console.log(this.state.lists);
  }

  onLaunchCreateModal(users?: Array<any>) {
    this.isListsCreate = true;
    this.listUsers = users ? users : null;
    setTimeout(() => { $('#listsCreate').modal(); }, 1);
  }

  onLaunchImportModal() {
    this.isListsImport = true;
    setTimeout(() => { $('#listsImport').modal(); }, 1);
  }

  onEditedList(editedList) {
    this.isListsEdit = false;
    let _state = Object.assign({}, this.state, {
      lists: this.state.lists.map(list => {
        if (list.id === editedList.id) {
          return list = editedList;
        }
        return list;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeletedList(listId: number) {
    this.isListsDelete = false;
    let _state = Object.assign({}, this.state);

    _state.lists = _state.lists.filter(list => {
      if (list.id !== listId) { return list; }
      return;
    });

    this.state = Object.assign({}, this.state, { lists: _state.lists });
  }

  ngOnInit() { }
}
