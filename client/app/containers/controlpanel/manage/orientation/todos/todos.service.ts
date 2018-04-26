import { URLSearchParams, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base';

@Injectable()
export class TodosService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TodosService.prototype);
  }

  getTodos(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_TODOS
    }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createTodo(body, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  deleteTodo(id, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  editTodo(id, body, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }
}
