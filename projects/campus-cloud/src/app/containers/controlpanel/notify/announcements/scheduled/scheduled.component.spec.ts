import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { delay } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockAnnouncement } from './../tests/mocks';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockUser } from '@campus-cloud/session/mock/user';
import { ModalService } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { AnnouncementsModule } from './../announcements.module';
import { AnnouncementsService } from './../announcements.service';
import { AnnouncementPriority, AnnouncementStatus } from '../model';
import { AnnouncementScheduledComponent } from './scheduled.component';
import { AnnouncementDeleteComponent } from './../delete/announcements-delete.component';
import { CPTableSorting } from '@projects/campus-cloud/src/app/shared/components/cp-table/interfaces';

describe('AnnouncementScheduledComponent', () => {
  let session: CPSession;
  let modalService: ModalService;
  let service: AnnouncementsService;
  let component: AnnouncementScheduledComponent;
  let fixture: ComponentFixture<AnnouncementScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [CPTestModule, AnnouncementsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementScheduledComponent);

    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    modalService = TestBed.get(ModalService);
    service = TestBed.get(AnnouncementsService);

    fixture.detectChanges();
  });

  describe('onNavigate', () => {
    it('should set page', () => {
      const expected = 2;
      component.page = 1;

      component.onNavigate(expected);

      expect(component.page).toBe(expected);
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');

      component.onNavigate(2);

      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('doFilter', () => {
    it('should udpate state with priority and query', () => {
      component.state = {
        ...component.state,
        priority: AnnouncementPriority.regular,
        searchStr: ''
      };

      fixture.detectChanges();
      const query = 'query';
      const type = AnnouncementPriority.emergency;

      component.doFilter({ query, type });
      fixture.detectChanges();

      const { priority, searchStr } = component.state;

      expect(searchStr).toBe(query);
      expect(priority).toBe(priority);
    });

    it('should reset page to 1 when query is not empty and page is greater than 1', () => {
      component.page = 2;
      const query = 'query';
      const type = AnnouncementPriority.emergency;

      component.doFilter({ query, type });
      fixture.detectChanges();

      expect(component.page).toBe(1);
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      const query = 'query';
      const type = AnnouncementPriority.emergency;

      component.doFilter({ query, type });
      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('handleSort', () => {
    it('should update state sortField and sortDirection', () => {
      const expectedSortField = 'sortMe';
      component.state = {
        ...component.state,
        sortDirection: CPTableSorting.desc
      };

      fixture.detectChanges();
      component.handleSort(expectedSortField);

      const { sortField, sortDirection } = component.state;
      expect(sortField).toBe(expectedSortField);
      expect(sortDirection).toBe(CPTableSorting.asc);
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      component.handleSort('sorting');
      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('onAnnouncementDeleted', () => {
    it('should filter out deleted announcement from the state', () => {
      component.state = {
        ...component.state,
        announcements: [mockAnnouncement]
      };

      expect(component.state.announcements.length).toBe(1);
      component.onAnnouncementDeleted(mockAnnouncement.id);
      expect(component.state.announcements.length).toBe(0);
    });

    it('should update component rows', () => {
      spyOn(component, 'setRows');
      component.state = {
        ...component.state,
        announcements: [mockAnnouncement]
      };
      component.onAnnouncementDeleted(mockAnnouncement.id);

      expect(component.setRows).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should open AnnouncementDeleteComponent modal', () => {
      const spy: jasmine.Spy = spyOn(modalService, 'open');

      component.onDelete(mockAnnouncement);

      const [deleteComponent, , config] = spy.calls.mostRecent().args;
      const { data, onClose, onAction } = config;

      expect(onClose).toBeDefined();
      expect(onAction).toBeDefined();
      expect(data).toBe(mockAnnouncement);
      expect(new deleteComponent() instanceof AnnouncementDeleteComponent).toBe(true);
    });
  });

  describe('setColumns', () => {
    it('should set sortable columns', () => {
      const columns = component.setColumns();
      const [, , notifyAtColumn] = columns;

      expect(columns.length).toBe(4);
      expect(notifyAtColumn.sortable).toBe(true);
      expect(notifyAtColumn.onClick).toBeDefined();
      expect(notifyAtColumn.sortingDirection).toBeDefined();
    });
  });

  describe('fetch', () => {
    it('should set state to loading', () => {
      component.fetch();
      expect(component.state.loading).toBe(true);
    });

    it('should pass right query params', () => {
      const spy: jasmine.Spy = spyOn(service, 'getAnnouncements').and.returnValue(
        of([mockAnnouncement])
      );

      component.fetch();
      const [params, startRange, endRange] = spy.calls.mostRecent().args;
      expect(endRange).toBe(component.endRange);
      expect(startRange).toBe(component.startRage);
      expect(params.get('statuses')).toBe(
        `${AnnouncementStatus.error},${AnnouncementStatus.pending}`
      );
      expect(params.get('priority')).toBe(component.state.priority);
      expect(params.get('search_str')).toBe(component.state.searchStr);
      expect(params.get('sort_field')).toBe(component.state.sortField);
      expect(params.get('school_id')).toBe(session.school.id.toString());
    });

    it('should update state on successful response', fakeAsync(() => {
      spyOn(service, 'getAnnouncements').and.returnValue(of([mockAnnouncement]).pipe(delay(1)));

      component.fetch();
      expect(component.state.loading).toBe(true);
      tick(1);
      expect(component.state.loading).toBe(false);
      expect(component.state.announcements.length).toBe(1);
    }));

    it('should set rows and columns', () => {
      spyOn(service, 'getAnnouncements').and.returnValue(of([mockAnnouncement]));

      component.fetch();
      fixture.detectChanges();
      expect(component.rows.length).toBe(1);
      expect(component.columns.length).toBe(4);
    });

    it('should handle errors', () => {
      spyOn(service, 'getAnnouncements').and.returnValue(
        throwError(new HttpErrorResponse({ status: 400 }))
      );
      const errorHandlerSpy = spyOn(component, 'errorHandler');

      component.fetch();

      expect(errorHandlerSpy).toHaveBeenCalled();
    });
  });
});
