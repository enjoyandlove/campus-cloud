import { of } from 'rxjs';

export class MockDashboardService {
  getGeneralInformation() {
    return of({});
  }
}
