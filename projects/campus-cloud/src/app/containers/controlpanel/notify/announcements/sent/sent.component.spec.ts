import { BaseComponent } from '@campus-cloud/base/base.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { AnnouncementPriority } from '../model';
import { CPSession } from '@campus-cloud/session';
import { mockAnnouncement } from './../tests/mocks';
import { AnnouncementDeleteComponent } from './../delete';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { AnnouncementSentComponent } from './sent.component';
import { ModalService } from '@campus-cloud/shared/services';
import { AnnouncementsModule } from './../announcements.module';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { AnnouncementsService } from './../announcements.service';

describe('AnnouncementSentComponent', () => {
  let session: CPSession;
  let modalService: ModalService;
  let service: AnnouncementsService;
  let component: AnnouncementSentComponent;
  let fixture: ComponentFixture<AnnouncementSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [CPTestModule, AnnouncementsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementSentComponent);
    component = fixture.componentInstance;

    service = TestBed.get(AnnouncementsService);
    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    modalService = TestBed.get(ModalService);

    spyOn(component.store, 'dispatch').and.callThrough();
    spyOn(service, 'getAnnouncements').and.returnValue(of([mockAnnouncement]));
    fixture.detectChanges();
  });

  it('should update header', () => {
    expect(component.store.dispatch).toHaveBeenCalled();
  });

  describe('onLauncDeleteModal', () => {
    it('should open AnnouncementDeleteComponent modal', () => {
      const spy: jasmine.Spy = spyOn(modalService, 'open');

      component.onLauncDeleteModal(mockAnnouncement);

      const [deleteComponent, , config] = spy.calls.mostRecent().args;
      const { data, onClose, onAction } = config;

      expect(onClose).toBeDefined();
      expect(onAction).toBeDefined();
      expect(data).toBe(mockAnnouncement);
      expect(new deleteComponent() instanceof AnnouncementDeleteComponent).toBe(true);
    });
  });

  describe('onPaginationNext', () => {
    it('should call goToNext', () => {
      spyOn(BaseComponent.prototype, 'goToNext');
      component.onPaginationNext();
      expect(BaseComponent.prototype.goToNext).toHaveBeenCalled();
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      component.onPaginationNext();
      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('onPaginationPrevious', () => {
    it('should call goToNext', () => {
      spyOn(BaseComponent.prototype, 'goToPrevious');
      component.onPaginationPrevious();
      expect(BaseComponent.prototype.goToPrevious).toHaveBeenCalled();
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');
      component.onPaginationPrevious();
      expect(component.fetch).toHaveBeenCalled();
    });
  });

  describe('onDeleted', () => {
    beforeEach(() => {
      component.state = {
        ...component.state,
        messages: [mockAnnouncement]
      };
      fixture.detectChanges();
    });

    it('should remove deleted announcement from state', () => {
      expect(component.state.messages.length).toBe(1);

      component.onDeleted(mockAnnouncement.id);
      expect(component.state.messages.length).toBe(0);
    });

    it('should call resetPagination when messages length is zero and page number is greater than 1', () => {
      component.pageNumber = 2;
      spyOn(component, 'resetPagination');

      component.onDeleted(mockAnnouncement.id);

      expect(component.resetPagination).toHaveBeenCalled();
    });

    it('should not call fetch when messages length is greater than zero or page number is 1', () => {
      component.pageNumber = 1;
      spyOn(component, 'resetPagination');

      component.onDeleted(mockAnnouncement.id);

      expect(component.resetPagination).not.toHaveBeenCalled();

      component.pageNumber = 2;
      const messages = [
        mockAnnouncement,
        {
          ...mockAnnouncement,
          id: mockAnnouncement.id + 1
        }
      ];

      component.state = {
        ...component.state,
        messages: messages
      };

      fixture.detectChanges();

      component.onDeleted(mockAnnouncement.id);
      expect(component.resetPagination).not.toHaveBeenCalled();
    });
  });

  describe('doFilter', () => {
    it('should call super resetPagination when type is truthy', () => {
      spyOn(BaseComponent.prototype, 'resetPagination');

      component.doFilter({ type: true, query: '' });

      expect(BaseComponent.prototype.resetPagination).toHaveBeenCalled();
    });

    it('should not call super resetPagination when type is truthy', () => {
      spyOn(BaseComponent.prototype, 'resetPagination');

      component.doFilter({ type: false, query: '' });

      expect(BaseComponent.prototype.resetPagination).not.toHaveBeenCalled();
    });

    it('should call super resetPagination when query is truthy', () => {
      spyOn(BaseComponent.prototype, 'resetPagination');

      component.doFilter({ type: AnnouncementPriority.emergency, query: 'some' });

      expect(BaseComponent.prototype.resetPagination).toHaveBeenCalled();
    });

    it('should not call super resetPagination when query is truthy', () => {
      spyOn(BaseComponent.prototype, 'resetPagination');

      component.doFilter({ type: null, query: '' });

      expect(BaseComponent.prototype.resetPagination).not.toHaveBeenCalled();
    });

    it('should update query and type state from argument', () => {
      const expected = {
        query: 'some',
        type: AnnouncementPriority.emergency
      };

      component.doFilter(expected);

      const { type, query } = component.state;

      expect(type).toBe(expected.type);
      expect(query).toBe(expected.query);
    });

    it('should call fetch', () => {
      spyOn(component, 'fetch');

      component.doFilter({ type: AnnouncementPriority.emergency, query: '' });

      expect(component.fetch).toHaveBeenCalled();
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
