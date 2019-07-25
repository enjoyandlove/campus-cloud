import { of } from 'rxjs';

export class MockSchoolService {}

export class MockBannerService {}

export class MockFileUploadService {
  placeholder;
  validImage(some) {
    this.placeholder = some;
    return true;
  }

  uploadImage(some) {
    this.placeholder = some;
    return of('http://mock.url');
  }
}
