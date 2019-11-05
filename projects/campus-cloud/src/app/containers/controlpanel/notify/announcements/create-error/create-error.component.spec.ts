import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { MODAL_DATA, IModal } from '@campus-cloud/shared/services';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { AnnouncementCreateErrorComponent } from './create-error.component';

describe('AnnouncementCreateErrorComponent', () => {
  let de: DebugElement;
  let data: IModal;
  let deledeModal: CPDeleteModalComponent;
  let component: AnnouncementCreateErrorComponent;
  let fixture: ComponentFixture<AnnouncementCreateErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        {
          provide: MODAL_DATA,
          useValue: {
            onAction: () => {},
            onClose: () => {}
          }
        }
      ],
      declarations: [AnnouncementCreateErrorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementCreateErrorComponent);
    de = fixture.debugElement;
    deledeModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;
    data = TestBed.get(MODAL_DATA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call onClose, on delete modal cancelClick', () => {
    spyOn(component, 'onClose');
    deledeModal.cancelClick.emit(null);
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call onSendNow, on send now button click', () => {
    spyOn(component, 'onSendNow');
    const sendNowBtn: HTMLButtonElement = getElementByCPTargetValue(de, 'send-now-btn')
      .nativeElement;
    sendNowBtn.click();
    expect(component.onSendNow).toHaveBeenCalled();
  });

  it('should call onGoBack, on go back button click', () => {
    spyOn(component, 'onGoBack');
    const goBackBtn: HTMLButtonElement = getElementByCPTargetValue(de, 'go-back-btn').nativeElement;
    goBackBtn.click();
    expect(component.onGoBack).toHaveBeenCalled();
  });

  describe('onClose', () => {
    it('should call modal onClose event', () => {
      spyOn(data, 'onClose');
      component.onClose();
      expect(data.onClose).toHaveBeenCalled();
    });
  });

  describe('onGoBack', () => {
    it('should call modal onClose event', () => {
      spyOn(data, 'onClose');
      component.onGoBack();
      expect(data.onClose).toHaveBeenCalled();
    });
  });

  describe('onSendNow', () => {
    it('should call modal onAction event', () => {
      spyOn(data, 'onAction');
      component.onSendNow();
      expect(data.onAction).toHaveBeenCalled();
    });

    it('should call modal onClose event', () => {
      spyOn(data, 'onClose');
      component.onSendNow();
      expect(data.onClose).toHaveBeenCalled();
    });
  });
});
