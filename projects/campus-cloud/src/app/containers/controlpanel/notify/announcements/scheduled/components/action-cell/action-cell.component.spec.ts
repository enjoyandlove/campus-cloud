import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AnnouncementStatus } from '../../../model';
import { mockAnnouncement } from './../../../tests/mocks';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { ScheduledActionCellComponent } from './action-cell.component';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';
import { CPTableCloseComponent } from '@campus-cloud/shared/components/cp-table/components';

describe('ScheduledActionCellComponent', () => {
  let de: DebugElement;
  let component: ScheduledActionCellComponent;
  let fixture: ComponentFixture<ScheduledActionCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, CommonIntegrationsModule],
      declarations: [ScheduledActionCellComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledActionCellComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.announcement = mockAnnouncement;
    fixture.detectChanges();
  });

  describe('hasError', () => {
    it('should return true when announcement has error status', () => {
      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.pending
      };

      fixture.detectChanges();

      expect(component.hasError).toBe(false);

      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.error
      };

      fixture.detectChanges();

      expect(component.hasError).toBe(true);
    });
  });

  describe('isPending', () => {
    it('should return true when announcement status is pending', () => {
      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.pending
      };

      fixture.detectChanges();

      expect(component.isPending).toBe(true);

      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.error
      };

      fixture.detectChanges();

      expect(component.isPending).toBe(false);
    });
  });

  describe('isExternal', () => {
    it('should return true when announcement is_external is true', () => {
      component.announcement = {
        ...component.announcement,
        is_external: true
      };

      fixture.detectChanges();

      expect(component.isExternal).toBe(true);

      component.announcement = {
        ...component.announcement,
        is_external: false
      };

      fixture.detectChanges();

      expect(component.isExternal).toBe(false);
    });
  });

  describe('HTML template', () => {
    it('should render a delete button listening to the handleClick event', () => {
      spyOn(component.deleteClick, 'emit');

      const closeBtn: CPTableCloseComponent = de.query(By.directive(CPTableCloseComponent))
        .componentInstance;

      expect(closeBtn).toBeDefined();

      closeBtn.handleClick.emit();
      expect(component.deleteClick.emit).toHaveBeenCalled();
    });

    it('should not render the edit button when announcement status is pending', () => {
      let editBtn: DebugElement;

      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.error
      };

      fixture.detectChanges();
      editBtn = getElementByCPTargetValue(de, 'edit-btn');

      expect(editBtn).toBeNull();

      component.announcement = {
        ...component.announcement,
        status: AnnouncementStatus.pending
      };

      const cdr = de.injector.get<ChangeDetectorRef>(ChangeDetectorRef as any);
      cdr.detectChanges();
      editBtn = getElementByCPTargetValue(de, 'edit-btn');

      expect(editBtn).not.toBeNull();
    });
  });
});
