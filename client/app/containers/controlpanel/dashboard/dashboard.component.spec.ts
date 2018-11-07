/*tslint:disable:max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CPSession } from '../../../session';
import { DashboardModule } from './dashboard.module';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { configureTestSuite } from '../../../shared/tests';
import { DashboardUtilsService } from './dashboard.utils.service';
import { MockRouter } from './__tests__/dashboard.activatedroute';
import { MockDashboardService } from './__tests__/dashboard.service';
import { CPI18nService } from './../../../shared/services/i18n.service';
import { mockUser, mockSchool } from '../../../session/mock';

describe('DashboardComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          DashboardUtilsService,
          CPSession,
          CPI18nService,
          { provide: DashboardService, useClass: MockDashboardService },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockRouter }
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let route: MockRouter;
  let comp: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    comp = fixture.componentInstance;
    route = TestBed.get(ActivatedRoute);

    comp.session.g.set('user', mockUser);
    comp.session.g.set('school', mockSchool);
  });

  it('shoudld init', () => {
    expect(comp).toBeTruthy();
  });

  it('should run setup on init based on the queryParams', () => {
    const spy: jasmine.Spy = spyOn(comp, 'setUp');

    comp.ngOnInit();

    route._setParam({});

    expect(spy).toHaveBeenCalledTimes(2);

    spy.calls.reset();

    route._setParam({ start: 123 });

    comp.ngOnInit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
