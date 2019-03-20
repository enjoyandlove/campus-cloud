/*tslint:disable:max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import * as tests from '../tests/';
import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { DashboardModule } from '../dashboard.module';
import { DashboardService } from '../dashboard.service';
import { mockUser, mockSchool } from '@app/session/mock';
import { DashboardBaseComponent } from './base.component';
import { CPI18nService } from '@shared/services/i18n.service';
import { DashboardUtilsService } from '../dashboard.utils.service';

describe('DashboardBaseComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          DashboardUtilsService,
          CPSession,
          CPI18nService,
          { provide: DashboardService, useClass: tests.MockDashboardService },
          { provide: Router, useClass: tests.MockRouter },
          { provide: ActivatedRoute, useClass: tests.MockRouter }
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let route: tests.MockRouter;
  let comp: DashboardBaseComponent;
  let fixture: ComponentFixture<DashboardBaseComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBaseComponent);
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
