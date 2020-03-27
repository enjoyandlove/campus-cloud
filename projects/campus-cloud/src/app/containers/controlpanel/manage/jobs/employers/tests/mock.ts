import { of } from 'rxjs';

import { MOCK_IMAGE } from '@campus-cloud/shared/tests';

export class MockEmployerService {
  getEmployers() {
    return of([mockEmployer]);
  }
}

export const mockEmployer = {
  id: 84,
  logo_url: MOCK_IMAGE,
  name: 'Hello World!',
  email: 'test@test.com',
  description: 'This is description'
};
