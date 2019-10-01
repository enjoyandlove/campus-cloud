import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { mockSchool } from '@campus-cloud/session/mock';
import { CalendarsModule } from '../calendars.module';
import { CalendarsService } from '../calendars.services';
import { CalendarsDetailComponent } from './calendars-details.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { MockCalendarsService, mockCalendar, MockActivatedRoute } from '../tests/mocks';

describe('CalendarsDetailComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [
          provideMockStore(),
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: CalendarsService, useClass: MockCalendarsService }
        ],
        imports: [CPTestModule, CalendarsModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session: CPSession;
  let fixture: ComponentFixture<CalendarsDetailComponent>;
  let component: CalendarsDetailComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarsDetailComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    component.calendarId = mockCalendar.id;

    fixture.detectChanges();
  }));

  describe('onPaginationNext', () => {
    beforeEach(() => {
      spyOn(BaseComponent.prototype, 'goToNext');
    });

    it('should call super goToNext', () => {
      component.onPaginationNext();

      expect(BaseComponent.prototype.goToNext).toHaveBeenCalled();
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      component.onPaginationNext();
      expect(component.fetch).toHaveBeenCalledWith();
    });
  });

  describe('onPaginationPrevious', () => {
    beforeEach(() => {
      spyOn(BaseComponent.prototype, 'goToPrevious');
    });

    it('should call super goToPrevious', () => {
      component.onPaginationPrevious();

      expect(BaseComponent.prototype.goToPrevious).toHaveBeenCalled();
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      component.onPaginationPrevious();
      expect(component.fetch).toHaveBeenCalledWith();
    });
  });

  describe('onSearch', () => {
    it('should set search_str state', () => {
      const expected = 'expected';
      component.onSearch(expected);

      const { search_str } = component.state;

      expect(search_str).toBe(expected);
    });

    it('should call resetPagination', () => {
      spyOn(component, 'resetPagination');

      component.onSearch('');

      expect(component.resetPagination).toHaveBeenCalled();
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');

      component.onSearch('');

      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('fetch', () => {
    let spyGetCalendarById: jasmine.Spy;
    let spyGetItemsByCalendarId: jasmine.Spy;
    beforeEach(() => {
      component.calendar = null;
      spyGetCalendarById = spyOn(component.service, 'getCalendarById').and.callThrough();
      spyGetItemsByCalendarId = spyOn(component.service, 'getItemsByCalendarId').and.callThrough();

      component.state = {
        items: [],
        search_str: 'search_str',
        sort_field: 'sort_field',
        sort_direction: 'sort_direction'
      };

      fixture.detectChanges();
      component.fetch();
    });

    it('should pass right params for item search', () => {
      const [, , params] = <[number, number, HttpParams]>(
        spyGetItemsByCalendarId.calls.mostRecent().args
      );

      expect(params.get('search_str')).toBe(component.state.search_str);
      expect(params.get('sort_field')).toBe(component.state.sort_field);
      expect(params.get('sort_direction')).toBe(component.state.sort_direction);
      expect(params.get('school_id').toString()).toBe(mockSchool.id.toString());
      expect(params.get('academic_calendar_id').toString()).toBe(mockCalendar.id.toString());
    });

    it('should pass right params for calendarSearch search', () => {
      const [calendarId, params] = <[number, HttpParams]>spyGetCalendarById.calls.mostRecent().args;

      expect(calendarId).toBe(mockCalendar.id);
      expect(params.get('school_id').toString()).toBe(mockSchool.id.toString());
    });

    it('should set calendar to value returned by the api', () => {
      expect(component.calendar).toBe(mockCalendar);
    });
  });

  describe('doSort', () => {
    let sortField: string;

    beforeEach(() => {
      sortField = 'sort_field';
      spyOn(component, 'fetch');
      component.doSort(sortField);
    });
    it('should set sort_field state to the value passed to the function', () => {
      const { sort_field } = component.state;
      expect(sort_field).toEqual(sortField);
    });

    it('should call fetch', () => {
      expect(component.fetch).toHaveBeenCalledWith();
    });

    it('should toggle sort_direction', () => {
      let sortDirection;
      component.state = {
        ...component.state,
        sort_direction: 'asc'
      };

      fixture.detectChanges();
      component.doSort('');

      sortDirection = component.state.sort_direction;
      expect(sortDirection).toEqual('desc');

      fixture.detectChanges();
      component.doSort('');

      sortDirection = component.state.sort_direction;
      expect(sortDirection).toEqual('asc');
    });
  });
});
