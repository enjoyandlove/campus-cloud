import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { mockIntegration } from '../tests';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { CPDeleteModalComponent } from '@shared/components';
import { ModalService, MODAL_DATA, CPI18nService } from '@shared/services';
import { AnnouncementsIntegrationDeleteComponent } from './delete.component';

describe('AnnouncementsIntegrationDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [AnnouncementsIntegrationDeleteComponent],
        providers: [
          ModalService,
          CPI18nService,
          {
            provide: MODAL_DATA,
            useValue: {
              onClose: () => {},
              data: mockIntegration
            }
          }
        ],
        imports: [SharedModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let cpDeleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<AnnouncementsIntegrationDeleteComponent>;
  let component: AnnouncementsIntegrationDeleteComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnnouncementsIntegrationDeleteComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    cpDeleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDeleteClick on cp-delete-modal deleteClick event', () => {
    spyOn(component, 'onDeleteClick');

    cpDeleteModal.deleteClick.emit();

    expect(component.onDeleteClick).toHaveBeenCalled();
  });

  it('should call modal.onClose on cancelClick', () => {
    spyOn(component.modal, 'onClose');

    cpDeleteModal.cancelClick.emit();

    expect(component.modal.onClose).toHaveBeenCalled();
  });
});
