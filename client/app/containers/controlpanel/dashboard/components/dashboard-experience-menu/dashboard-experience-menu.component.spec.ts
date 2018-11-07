import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationExtras } from '@angular/router';

import { MockRouter } from '../../__tests__/dashboard.activatedroute';
import { MockDashboardService } from '../../__tests__/dashboard.service';
import { CPSession } from '../../../../../session';
import { configureTestSuite } from '../../../../../shared/tests';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { DashboardModule } from '../../dashboard.module';
import { DashboardService } from '../../dashboard.service';
import { DashboardExperienceMenuComponent } from './dashboard-experience-menu.component';

describe('DashboardExperienceMenuComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          DashboardUtilsService,
          CPSession,
          { provide: DashboardService, useClass: MockDashboardService },
          { provide: Router, useClass: MockRouter }
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<DashboardExperienceMenuComponent>;
  let comp: DashboardExperienceMenuComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExperienceMenuComponent);
    comp = fixture.componentInstance;

    comp.experiences = [{ action: 1, label: 'dummy' }];
    comp.paramName = 'c_activity_exp_id';
  });

  it('shoudld init', () => {
    expect(comp).toBeTruthy();
  });

  it('should append query params to route', () => {
    const mockExperienceId = 1;
    const spy: jasmine.Spy = spyOn(comp.router, 'navigate');
    comp.updateRouter({ action: mockExperienceId });

    const [routeTo, params] = spy.calls.mostRecent().args;
    const expectedParam: NavigationExtras = {
      queryParamsHandling: 'merge',
      queryParams: {
        [comp.paramName]: mockExperienceId
      }
    };

    expect(routeTo).toEqual(['/dashboard']);
    expect(params).toEqual(expectedParam);
  });
});
