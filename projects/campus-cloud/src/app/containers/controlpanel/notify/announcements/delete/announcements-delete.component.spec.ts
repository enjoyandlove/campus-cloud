import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { delay } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockAnnouncement } from './../tests/mocks';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { AnnouncementsModule } from './../announcements.module';
import { AnnouncementsService } from './../announcements.service';
import { NotifyUtilsService } from './../../notify.utils.service';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { AnnouncementDeleteComponent } from './announcements-delete.component';
import { ModalService, MODAL_DATA, IModal } from '@campus-cloud/shared/services';

describe('AnnouncementDeleteComponent', () => {
  let modal: IModal;
  let de: DebugElement;
  let session: CPSession;
  let modalService: ModalService;
  let service: AnnouncementsService;
  let deleteModal: CPDeleteModalComponent;
  let component: AnnouncementDeleteComponent;
  let fixture: ComponentFixture<AnnouncementDeleteComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, AnnouncementsModule],
      providers: [
        NotifyUtilsService,
        {
          provide: MODAL_DATA,
          useValue: {
            data: mockAnnouncement,
            onAction: () => {},
            onClose: () => {}
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementDeleteComponent);

    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    de = fixture.debugElement;
    modal = TestBed.get(MODAL_DATA);
    modalService = TestBed.get(ModalService);
    service = TestBed.get(AnnouncementsService);

    deleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

    fixture.detectChanges();
  });

  it('should call onArchive on cp-delete-modal deleteClick', () => {
    spyOn(component, 'onArchive');
    deleteModal.deleteClick.emit();

    expect(component.onArchive).toHaveBeenCalled();
  });

  it('should call doReset on cp-delete-modal cancelClick', () => {
    spyOn(component, 'doReset');
    deleteModal.cancelClick.emit();

    expect(component.doReset).toHaveBeenCalled();
  });

  describe('onArchive success', () => {
    it('should call trackDeleteEvent on success', fakeAsync(() => {
      spyOn(component, 'trackDeleteEvent');
      spyOn(service, 'deleteAnnouncement').and.returnValue(of({}).pipe(delay(1)));

      component.onArchive();
      tick(1);

      expect(component.trackDeleteEvent).toHaveBeenCalled();
    }));

    it('should call modal onClose on success', fakeAsync(() => {
      spyOn(modal, 'onClose');
      spyOn(service, 'deleteAnnouncement').and.returnValue(of({}).pipe(delay(1)));

      component.onArchive();
      tick(1);

      expect(modal.onClose).toHaveBeenCalled();
    }));

    it('should call modal onAction on success', fakeAsync(() => {
      spyOn(modal, 'onAction');
      spyOn(service, 'deleteAnnouncement').and.returnValue(of({}).pipe(delay(1)));

      component.onArchive();
      tick(1);

      expect(modal.onAction).toHaveBeenCalled();
    }));

    it('should call modal onClose on error', fakeAsync(() => {
      spyOn(modal, 'onClose');
      spyOn(service, 'deleteAnnouncement').and.returnValue(
        throwError(new HttpErrorResponse({ status: 400 })).pipe(delay(1))
      );

      component.onArchive();
      tick(1);

      expect(modal.onClose).toHaveBeenCalled();
    }));
  });
});
