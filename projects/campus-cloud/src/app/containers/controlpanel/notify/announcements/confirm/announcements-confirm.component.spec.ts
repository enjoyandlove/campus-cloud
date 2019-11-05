import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { AnnouncementsModule } from './../announcements.module';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { AnnouncementsConfirmComponent } from './announcements-confirm.component';
import { MODAL_DATA, IModal, CPI18nService } from '@campus-cloud/shared/services';

describe('AnnouncementsConfirmComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MODAL_DATA,
            useValue: {
              data: {
                isUrgent: false,
                isEmergency: false,
                isCampusWide: false
              },
              onAction: () => {},
              onClose: () => {}
            }
          }
        ],
        imports: [CPTestModule, AnnouncementsModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let modal: IModal;
  let cpI18n: CPI18nService;
  let fixture: ComponentFixture<AnnouncementsConfirmComponent>;
  let component: AnnouncementsConfirmComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnnouncementsConfirmComponent);
    component = fixture.componentInstance;

    modal = TestBed.get(MODAL_DATA);
    cpI18n = TestBed.get(CPI18nService);

    fixture.detectChanges();
  }));

  describe('doTeardown', () => {
    it('should call modal onClose', () => {
      spyOn(modal, 'onClose');
      component.doTeardown();
      expect(modal.onClose).toHaveBeenCalled();
    });

    it('should emit teardown event', () => {
      spyOn(component.teardown, 'emit');
      component.doTeardown();
      expect(component.teardown.emit).toHaveBeenCalled();
    });
  });

  describe('onConfirm', () => {
    it('should call modal onAction', () => {
      spyOn(modal, 'onAction');
      component.onConfirm();
      expect(modal.onAction).toHaveBeenCalled();
    });
  });

  it('should have a title', () => {
    expect(component.title).toBeDefined();
  });

  it('should have a body', () => {
    expect(component.body).toBeDefined();
  });

  describe('getTitle', () => {
    beforeEach(() => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: false,
        isCampusWide: false
      };
    });
    it('should return return default value when no conditions are met', () => {
      expect(component.getTitle()).toEqual(cpI18n.translate('announcement_confirm_campus_wide'));
    });

    it('should return campus wide and emergency message when isCampusWide and isEmergency are true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: true,
        isCampusWide: true
      };

      fixture.detectChanges();
      expect(component.getTitle()).toEqual(
        cpI18n.translate('announcement_confirm_campus_wide_and_emergency')
      );
    });

    it('should return campus wide and urgent message when isCampusWide and isUrgent are true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: true,
        isEmergency: false,
        isCampusWide: true
      };

      fixture.detectChanges();
      expect(component.getTitle()).toEqual(
        cpI18n.translate('announcement_confirm_campus_wide_and_urgent')
      );
    });

    it('should return campus wide and urgent message when only isEmergency is true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: true,
        isCampusWide: false
      };

      fixture.detectChanges();
      expect(component.getTitle()).toEqual(cpI18n.translate('announcement_confirm_emergency'));
    });

    it('should return campus wide and urgent message when only isUrgent is true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: true,
        isEmergency: false,
        isCampusWide: false
      };

      fixture.detectChanges();
      expect(component.getTitle()).toEqual(cpI18n.translate('announcement_confirm_urgent'));
    });
  });

  describe('getBody', () => {
    beforeEach(() => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: false,
        isCampusWide: false
      };
    });
    it('should return return default value when no conditions are met', () => {
      expect(component.getBody()).toEqual(
        cpI18n.translate('announcement_confirm_campus_wide_body')
      );
    });

    it('should return campus wide and emergency message when isCampusWide and isEmergency are true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: true,
        isCampusWide: true
      };

      fixture.detectChanges();
      expect(component.getBody()).toEqual(
        cpI18n.translate('announcement_confirm_campus_wide_and_emergency_body')
      );
    });

    it('should return campus wide and urgent message when isCampusWide and isUrgent are true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: true,
        isEmergency: false,
        isCampusWide: true
      };

      fixture.detectChanges();
      expect(component.getBody()).toEqual(
        cpI18n.translate('announcement_confirm_campus_wide_and_urgent_body')
      );
    });

    it('should return campus wide and urgent message when only isEmergency is true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: false,
        isEmergency: true,
        isCampusWide: false
      };

      fixture.detectChanges();
      expect(component.getBody()).toEqual(cpI18n.translate('announcement_confirm_emergency_body'));
    });

    it('should return campus wide and urgent message when only isUrgent is true', () => {
      component.modal.data = {
        ...component.modal.data,
        isUrgent: true,
        isEmergency: false,
        isCampusWide: false
      };

      fixture.detectChanges();
      expect(component.getBody()).toEqual(cpI18n.translate('announcement_confirm_urgent_body'));
    });
  });
});
