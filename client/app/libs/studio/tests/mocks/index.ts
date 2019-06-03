import { ContentUtilsProviders } from '@libs/studio/providers';
import { of } from 'rxjs';

export class MockTilesService {
  placeholder;

  getSchoolServices(headers) {
    this.placeholder = headers;

    return of([]);
  }

  getServiceCategories(headers) {
    this.placeholder = headers;

    return of([]);
  }

  getSchoolCalendars(headers) {
    this.placeholder = headers;

    return of([]);
  }
}

export class MockStoreService {
  placeholder;

  getStores(headers) {
    this.placeholder = headers;

    return of([]);
  }
}

export const mockStudioContentResource = {
  id: ContentUtilsProviders.contentTypes.single,
  label: 'some label'
};
