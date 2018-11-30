import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { mockService } from '../tests/mock';
import { RootStoreModule } from '@app/store';
import mockSession from '@app/session/mock/session';
import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { configureTestSuite } from '@app/shared/tests';
import { CP_PRIVILEGES_MAP } from '@app/shared/constants';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesInfoComponent } from './services-info.component';
import { CPI18nService, AdminService } from '@app/shared/services';

class MockService {
  dummy;
  getServiceById(serviceId, start, end) {
    this.dummy = { serviceId, start, end };

    return of(mockService);
  }
}

describe('ServicesInfoComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [HttpClientModule, RouterTestingModule, ServicesModule, RootStoreModule],
        providers: [
          {
            provide: CPSession,
            useValue: mockSession
          },
          CPI18nService,
          AdminService,
          ServicesService,
          ServicesUtilsService,
          {
            provide: ServicesService,
            useClass: MockService
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: ServicesInfoComponent;
  let fixture: ComponentFixture<ServicesInfoComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesInfoComponent);
    component = fixture.componentInstance;
  });

  it(
    'should fetch admins by store id',
    async(() => {
      spyOn(component.adminService, 'getAdminByStoreId').and.returnValue(of([]));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const search: HttpParams = new HttpParams()
          .append('school_id', component.school.id.toString())
          .append('store_id', component.storeId.toString())
          .append('privilege_type', CP_PRIVILEGES_MAP.services.toString());
        expect(component.adminService.getAdminByStoreId).toHaveBeenCalledWith(search);
      });
    })
  );
});
