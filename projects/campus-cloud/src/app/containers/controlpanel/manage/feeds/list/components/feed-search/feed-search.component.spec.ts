import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../../../store';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { UserService } from '@campus-cloud/shared/services';
import { FeedSearchComponent } from './feed-search.component';
import { mockFeedGroup } from '@controlpanel/manage/feeds/tests';
import { CPTestModule } from '@campus-cloud/shared/tests/test.module';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

class MockFeedsService {
  getSocialGroups() {
    return of([]);
  }

  getGroupWallFeeds() {
    return of({ count: 1 });
  }

  getGroupWallCommentsByThreadId() {
    return of({ count: 1 });
  }

  getCampusWallsPostsExportData() {
    return of({ count: 1 });
  }
  getCampusWallsCommentExportData() {
    return of({ count: 1 });
  }
}
class MockUserService {
  getAll() {
    return of([]);
  }
}

describe('FeedSearchComponent', () => {
  let de: DebugElement;
  let session: CPSession;
  let formBuilder: FormBuilder;
  let feedService: FeedsService;
  let component: FeedSearchComponent;
  let fixture: ComponentFixture<FeedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CPTestModule,
        ReactiveFormsModule,
        StoreModule.forFeature('WALLS_STATE', {
          feeds: fromStore.feedsReducer,
          bannedEmails: fromStore.bannedEmailsReducer
        })
      ],
      declarations: [FeedSearchComponent],
      providers: [
        FeedsUtilsService,
        FeedsAmplitudeService,
        { provide: FeedsService, useClass: MockFeedsService },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSearchComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    de = fixture.debugElement;

    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);
    feedService = TestBed.inject(FeedsService);

    component.form = formBuilder.group({
      query: ['']
    });

    fixture.detectChanges();
  });

  describe('emitValue', () => {
    it('should emit current query, regardless of its value', () => {
      const spy = spyOn(component.feedSearch, 'emit');

      component.query.next('');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('');

      component.query.next('12');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('12');

      component.query.next('123');
      component.emitValue();
      expect(spy).toHaveBeenCalledWith('123');
    });

    // it('should be called when hitting enter on input field', () => {
    //   const spy = spyOn(component, 'emitValue');
    //   console.log(de);
    //   const input: HTMLInputElement = de.query(By.css('input[type="search"]')).nativeElement;

    //   input.focus();
    //   input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    //   expect(spy).toHaveBeenCalled();
    // });
  });

  describe('clear button', () => {
    it('should only be visble when input is not empty', () => {
      let button: HTMLButtonElement;

      component.input$.subscribe(() => {
        component.input.next('');
        button = de.query(By.css('button.unstyled-button')).nativeElement;
        expect(button.hidden).toBe(true);

        component.input.next('123');
        button = de.query(By.css('button.unstyled-button')).nativeElement;
        expect(button.hidden).toBe(false);
      });
    });
  });

  describe('query$', () => {
    it('should emit feedSearch when, query length is zero or greater than 3', () => {
      const spy = spyOn(component.feedSearch, 'emit');

      component.input$.subscribe(() => {
        // skip first
        component.input.next('');
        expect(spy).not.toHaveBeenCalled();

        component.input.next('123');
        expect(spy).toHaveBeenCalledWith('123');

        component.input.next('');
        expect(spy).toHaveBeenCalledWith('');
      });
    });
  });

  describe('getCount', () => {
    it('should include valid params', () => {
      const spy = spyOn(feedService, 'getCampusWallsPostsExportData').and.returnValue(
        of({ count: 1 })
      );
      const spy2 = spyOn(feedService, 'getCampusWallsCommentExportData').and.returnValue(
        of({ count: 1 })
      );

      component.getCount().subscribe(() => {
        const [campusWallParams] = spy.calls.mostRecent().args as [HttpParams];
        const [commentParams] = spy2.calls.mostRecent().args as [HttpParams];

        const acceptedParams = [
          'end',
          'start',
          'user_ids',
          'count_only',
          'group_id',
          'post_types',
          'school_id',
          'search_str',
          'flagged_by_users_only',
          'removed_by_moderators_only'
        ];

        expect(commentParams.keys().length).toBe(acceptedParams.length);
        expect(campusWallParams.keys().length).toBe(acceptedParams.length);

        acceptedParams.forEach((key) => {
          expect(commentParams.get(key)).toBeDefined(`${key} is not defined in commentParams`);
          expect(campusWallParams.get(key)).toBeDefined(
            `${key} is not defined in campusWallParams`
          );
        });
      });

      component.viewFilters$ = new BehaviorSubject({
        group: mockFeedGroup
      });
    });
  });
});
