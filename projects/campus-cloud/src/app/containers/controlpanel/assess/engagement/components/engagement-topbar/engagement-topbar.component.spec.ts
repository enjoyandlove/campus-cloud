import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { mockUser } from '@campus-cloud/session/mock/user';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EngagementService } from '../../engagement.service';
import { EngagementUtilsService } from './../../engagement.utils.service';
import { EngagementTopBarComponent } from './engagement-topbar.component';

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
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        CPI18nService,
        EngagementService,
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
