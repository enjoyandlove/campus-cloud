import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MockRouter } from './../../__tests__/dashboard.activatedroute';
import { MockDashboardService } from './../../__tests__/dashboard.service';
import { CPSession } from './../../../../../session';
import { configureTestSuite } from './../../../../../shared/tests';
import { DashboardUtilsService } from './../../dashboard.utils.service';
import { DashboardGeneralInformationComponent } from './dashboard-general-information.component';
import { DashboardModule } from '../../dashboard.module';
import { DashboardService } from '../../dashboard.service';

describe('DashboardGeneralInformationComponent', () => {
  configureTestSuite();
  let route: MockRouter;

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          DashboardUtilsService,
          CPSession,
          { provide: DashboardService, useClass: MockDashboardService },
          { provide: ActivatedRoute, useClass: MockRouter }
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<DashboardGeneralInformationComponent>;
  let comp: DashboardGeneralInformationComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGeneralInformationComponent);
    comp = fixture.componentInstance;

    route = TestBed.get(ActivatedRoute);
  });

  it('shoudld init', () => {
    expect(comp).toBeTruthy();
  });

  it('should not call fetch if params are missing', () => {
    const wrong = {
      start: 1,
      end: 1,
      label: 'hello'
    };

    spyOn(comp, 'fetch');
    comp.listenForQueryParamChanges();

    route._setParam(wrong);
    expect(comp.fetch).not.toHaveBeenCalled();
  });

  it('should call fetch if all params are present', () => {
    const rightParams = {
      start: 1,
      end: 1,
      label: 'hello',
      cga_exp_id: 1
    };

    spyOn(comp, 'fetch');
    comp.listenForQueryParamChanges();

    route._setParam(rightParams);
    expect(comp.fetch).toHaveBeenCalled();
    expect(comp.fetch).toHaveBeenCalledWith(rightParams.start, rightParams.end);
  });
});
