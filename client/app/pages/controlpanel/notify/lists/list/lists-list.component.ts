import { Component, OnInit } from '@angular/core';

import { ListsService } from '../lists.service';
import { BaseComponent } from '../../../../../base/base.component';

interface IState {
  lists: Array<any>;
}

const state: IState = {
  lists: []
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
    private listsService: ListsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.listsService.getLists())
      .then(res => this.state = Object.assign({}, this.state, { lists: res.data }))
      .catch(err => console.log(err));
  }

  onSearch(query) {
    console.log(query);
  }

  onCreatedList(list) {
    this.isListsCreate = false;
    this.state.lists = [list, ...this.state.lists];
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
