import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base';

@Injectable()
export class TodosService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TodosService.prototype);
  }

  getTodos(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_TODOS
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  createTodo(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/`;

    return super.post(url, body, search);
  }

  deleteTodo(id, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return super.delete(url, search);
  }

  editTodo(id, body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return super.update(url, body, search);
  }
}
