import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { FeedsInfoComponent } from './feeds-info.component';
import { FeedsModule } from '@controlpanel/manage/feeds/feeds.module';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

const groupParams = new HttpParams().set('group_id', '124');
const campusParams = new HttpParams().set('school_id', '157');

describe('FeedsInfoComponent', () => {
  configureTestSuite();

  let spy: jasmine.Spy;
  let session: CPSession;

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, FeedsModule],
        providers: []
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<FeedsInfoComponent>;
  let comp: FeedsInfoComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsInfoComponent);
    comp = fixture.componentInstance;

    comp.feedId = 123;
    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('should fetch campus thread', () => {
    spy = spyOn(comp.feedService, 'getCampusThreadById').and.returnValue(of([]));

    comp.fetch();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(comp.feedId, campusParams);
  });

  it('should fetch group thread', () => {
    comp.groupId = 124;
    spy = spyOn(comp.feedService, 'getGroupThreadById').and.returnValue(of([]));

    comp.fetch();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(comp.feedId, groupParams);
  });

  it('should return 404', fakeAsync(() => {
    const navigate = spyOn(comp.router, 'navigate');

    spy = spyOn(comp.feedService, 'getCampusThreadById').and.returnValue(
      throwError(new HttpErrorResponse({ status: 404 }))
    );

    const expected = ['/manage/feeds'];

    comp.fetch();

    tick();
    expect(spy).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(expected);
    expect(spy).toHaveBeenCalledWith(comp.feedId, campusParams);
  }));

  it('should return error', fakeAsync(() => {
    spy = spyOn(comp.feedService, 'getCampusThreadById').and.returnValue(
      throwError(new HttpErrorResponse({ status: 400 }))
    );

    comp.fetch();

    tick();
    expect(comp.error).toBe(true);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(comp.feedId, campusParams);
  }));
});
