import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { CPSession } from './../../../../../../session';
import { mockSchool } from './../../../../../../session/mock/school';
import { mockUser } from './../../../../../../session/mock/user';
import { EngagementUtilsService } from './../../engagement.utils.service';
import { EngagementTopBarComponent } from './engagement-topbar.component';
import { CPI18nService } from '../../../../../../shared/services';

class MockActivatedRoute {
  data = {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(
      observableOf({
        data: {
          sopa: 1
        }
      })
    )
  };

  snapshot = {
    queryParams: {}
  };
}

class MockSession {
  g = new Map();
}

describe('EngagementTopBarComponent', () => {
  // let session: CPSession;
  let comp: EngagementTopBarComponent;
  let fixture: ComponentFixture<EngagementTopBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementTopBarComponent],
      providers: [
        CPI18nService,
        EngagementUtilsService,
        { provide: CPSession, useClass: MockSession },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).overrideComponent(EngagementTopBarComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    });
    fixture = TestBed.createComponent(EngagementTopBarComponent);
    comp = fixture.componentInstance;

    // session = TestBed.get('session');

    comp.session.g.set('user', mockUser);
    comp.session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('ngOnInit', () => {
    const stateFromUrlSpy = spyOn(comp, 'getStateFromUrl');
    const initStateSpy = spyOn(comp, 'initState').and.callThrough();
    comp.ngOnInit();
    expect(comp.hasRouteData).not.toBeDefined();
    expect(stateFromUrlSpy).not.toHaveBeenCalled();
    expect(initStateSpy).toHaveBeenCalledTimes(1);
  });
});
