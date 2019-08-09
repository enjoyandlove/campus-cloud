import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class CategoriesService {
  constructor(private api: ApiService) {}

  getCategories(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS_CATEGORIES}/`;

    return this.api.get(url, search, true);
  }

  createCategory(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS_CATEGORIES}/`;

    return this.api.post(url, body, search, true);
  }

  updateCategory(body, categoryId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS_CATEGORIES}/${categoryId}`;

    return this.api.update(url, body, search, true);
  }

  deleteCategoryById(categoryId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS_CATEGORIES}/${categoryId}`;

    return this.api.delete(url, search, true);
  }
}
