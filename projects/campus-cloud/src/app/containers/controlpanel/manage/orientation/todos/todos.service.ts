import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

@Injectable()
export class TodosService {
  constructor(private api: ApiService) {}

  getTodos(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_TODOS}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  createTodo(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_TODOS}/`;

    return this.api.post(url, body, search);
  }

  deleteTodo(id, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return this.api.delete(url, search);
  }

  editTodo(id, body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_TODOS}/${id}`;

    return this.api.update(url, body, search);
  }
}
