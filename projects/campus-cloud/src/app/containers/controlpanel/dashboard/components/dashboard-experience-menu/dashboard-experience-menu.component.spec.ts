import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationExtras } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { CPSession } from '@campus-cloud/session';
import { DashboardModule } from '../../dashboard.module';
import { DashboardService } from '../../dashboard.service';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { MockRouter } from '../../tests/dashboard.activatedroute';
import { MockDashboardService } from '../../tests/dashboard.service';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { CPDropdownComponent } from '@campus-cloud/shared/components';
import { DashboardExperienceMenuComponent } from './dashboard-experience-menu.component';

describe('DashboardExperienceMenuComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          CPSession,
          provideMockStore(),
          DashboardUtilsService,
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
    comp.paramName = 'cga_exp_id';
  });

  it('shoudld init', () => {
    expect(comp).toBeTruthy();
  });

  it('should update router on cp-dropdown selected event', () => {
    const de = fixture.debugElement;
    spyOn(comp, 'updateRouter');
    const cpDropdown = de.query(By.directive(CPDropdownComponent));
    const cpDropdownComp: CPDropdownComponent = cpDropdown.componentInstance;
    cpDropdownComp.selected.emit({ label: 'hello', event: '2' });

    expect(comp.updateRouter).toHaveBeenCalled();
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
