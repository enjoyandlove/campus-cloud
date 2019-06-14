import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import { of } from 'rxjs';

import { mockSchool } from '@campus-cloud/session/mock';
import { IIntegrationData, ExtraDataType, IExtraData } from '../../models';

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

export const mockExtraData: IExtraData = {
  school_id: mockSchool.id,
  extra_data_type: ExtraDataType.DIRECTORY,
  config_data: { client_int: [] }
};

export const mockIntegrationData: IIntegrationData[] = [
  {
    extra_data: [mockExtraData]
  }
];

export class MockIntegrationDataService {
  getIntegrationData() {
    return of(mockIntegrationData);
  }
}
