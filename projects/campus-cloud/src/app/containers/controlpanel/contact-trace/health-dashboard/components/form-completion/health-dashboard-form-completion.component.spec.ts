import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CPSession } from '@campus-cloud/session';

import { HealthDashboardFormCompletionComponent } from './health-dashboard-form-completion.component';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { FormsService } from '../../../forms';
import { ChartsUtilsService } from '@campus-cloud/shared/services';
import { HealthDashboardUtilsService } from '../../health-dashboard.utils.service';
import { HealthDashboardService } from '../../health-dashboard.service';

describe('HealthDashboardFormCompletionComponent', () => {
  let component: HealthDashboardFormCompletionComponent;
  let fixture: ComponentFixture<HealthDashboardFormCompletionComponent>;
  let session: CPSession;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardFormCompletionComponent],
      imports: [CPTestModule],
      providers: [
        CPI18nPipe,
        CPSession,
        HealthDashboardService,
        ChartsUtilsService,
        FormsService,
        HealthDashboardUtilsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardFormCompletionComponent);
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
