import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base/http.service';

@Injectable()
export class CategoriesService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, CategoriesService.prototype);
  }

  getCategories(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS_CATEGORIES}/`;

    return super.get(url, search, true);
  }

  createCategory(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS_CATEGORIES}/`;

    return super.post(url, body, search, true);
  }

  updateCategory(body, categoryId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS_CATEGORIES
    }/${categoryId}`;

    return super.update(url, body, search, true);
  }

  deleteCategoryById(categoryId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS_CATEGORIES
    }/${categoryId}`;

    return super.delete(url, search, true);
  }
}
