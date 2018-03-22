import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base';

@Injectable()
export class TodosService extends BaseService {
  dummy;
  mockJson = require('./mockTodos.json');

  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TodosService.prototype);
  }

  getTodos(startRage: number, endRage: number, search?: URLSearchParams) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockJson).delay(300);
  }

  createTodo(body, search?: URLSearchParams) {
    this.dummy = [body, search];

    return Observable.of(this.mockJson).delay(300);
  }

  deleteTodo(id, search?: URLSearchParams) {
    this.dummy = [id, search];

    return Observable.of(this.mockJson).delay(300);
  }

  editTodo(id, body, search?: URLSearchParams) {
    this.dummy = [body, id, search];

    return Observable.of(body).delay(300);
  }

}
