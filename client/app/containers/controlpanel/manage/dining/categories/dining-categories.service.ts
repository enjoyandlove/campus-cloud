import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { API } from '@app/config/api';
import { IItem } from '@shared/components';
import { HTTPService } from '@app/base/http.service';
import { CategoryModel } from '@libs/locations/common/categories/model';

@Injectable()
export class DiningCategoriesService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DiningCategoriesService.prototype);
  }

  getCategories(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS_CATEGORIES}/`;

    return super.get(url, search, true);
  }

  getCategoriesType(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATION_CATEGORY_TYPE}/`;

    return <Observable<IItem[]>>super
      .get(url, search, true)
      .pipe(map(CategoryModel.setCategoryTypes));
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
