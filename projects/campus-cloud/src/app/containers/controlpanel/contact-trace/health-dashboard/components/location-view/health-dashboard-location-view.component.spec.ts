import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CPSession } from '@campus-cloud/session';

import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { ChartsUtilsService } from '@campus-cloud/shared/services';
import { HealthDashboardLocationViewComponent } from '.';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { HealthDashboardService } from '../../health-dashboard.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as fromStore from '../../store';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

class MockHealthDashboardService {
  getFormResponseStats() {
    return of([]);
  }
}

describe('HealthDashboardLocationViewComponent', () => {
  let component: HealthDashboardLocationViewComponent;
  let fixture: ComponentFixture<HealthDashboardLocationViewComponent>;
  let session: CPSession;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardLocationViewComponent],
      imports: [CPTestModule],
      providers: [
        CPI18nPipe,
        CPSession,
        ChartsUtilsService,
        ProvidersService,
        ServicesUtilsService,
        { provide: HealthDashboardService, useClass: MockHealthDashboardService },
        provideMockStore({
          selectors: [
            {
              selector: fromStore.selectDateFilter,
              value: { start: null, end: null }
            },
            {
              selector: fromStore.selectAudienceFilter,
              value: {
                route_id: null,
                cohort_type: null,
                label: '',
                listId: null
              }
            }
          ]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardLocationViewComponent);
    component = fixture.componentInstance;
    component.cpI18n = TestBed.get(CPI18nPipe);
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
