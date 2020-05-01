import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { mockService } from '../tests/mock';
import { CPSession } from '@campus-cloud/session';
import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { RootStoreModule } from '@campus-cloud/store';
import { AdminService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesInfoComponent } from './services-info.component';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { mockUser, mockSchool } from '@campus-cloud/session/mock';

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
        imports: [
          HttpClientModule,
          RouterTestingModule,
          ServicesModule,
          RootStoreModule,
          CPTestModule
        ],
        providers: [
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

  let session: CPSession;
  let component: ServicesInfoComponent;
  let fixture: ComponentFixture<ServicesInfoComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesInfoComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);
  });

  it('should fetch admins by store id', async(() => {
    spyOn(component.adminService, 'getAdminByStoreId').and.returnValue(of([]));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const search: HttpParams = new HttpParams()
        .append('school_id', mockSchool.id.toString())
        .append('store_id', component.storeId.toString())
        .append('privilege_type', CP_PRIVILEGES_MAP.services.toString());
      expect(component.adminService.getAdminByStoreId).toHaveBeenCalledWith(search);
    });
  }));
});
