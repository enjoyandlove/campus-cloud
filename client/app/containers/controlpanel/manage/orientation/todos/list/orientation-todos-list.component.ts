import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ITodo } from '../todos.interface';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { BaseComponent } from '../../../../../../base';
import { FORMAT } from '../../../../../../shared/pipes/date/date.pipe';
import { ActivatedRoute } from '@angular/router';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-orientation-todos-list',
  templateUrl: './orientation-todos-list.component.html',
  styleUrls: ['./orientation-todos-list.component.scss']
})
export class OrientationTodosListComponent extends BaseComponent implements OnInit {
  loading;
  selectedTodo = null;
  orientationId: number;
  launchEditModal = false;
  launchDeleteModal = false;
  launchCreateModal = false;
  dateFormat = FORMAT.DATETIME;

  state = {
    todos: [],
    search_str: null,
    sort_field: null,
    sort_direction: 'asc'
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TodosService,
    public route: ActivatedRoute
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  public fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('calendar_id', this.orientationId.toString());
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getTodos(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, todos: res.data }));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#todoCreate').modal();
      },

      1
    );
  }

  onCreated(newTodo: ITodo): void {
    this.launchCreateModal = false;
    this.state.todos = [newTodo, ...this.state.todos];
  }

  onEditedLink(editTodo: ITodo) {
    this.launchEditModal = false;
    this.selectedTodo = null;

    this.state = Object.assign({}, this.state, {
      todos: this.state.todos.map((todo) => (todo.id === editTodo.id ? editTodo : todo))
    });
  }

  onDeleted(todoId: number) {
    this.selectedTodo = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      todos: this.state.todos.filter((todo) => todo.id !== todoId)
    });

    if (this.state.todos.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.fetch();
  }
}
