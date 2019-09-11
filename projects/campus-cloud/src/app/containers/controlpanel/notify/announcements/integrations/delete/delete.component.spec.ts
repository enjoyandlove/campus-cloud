import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { mockIntegration } from '../tests';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { ModalService, MODAL_DATA } from '@campus-cloud/shared/services';
import { AnnouncementsIntegrationDeleteComponent } from './delete.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('AnnouncementsIntegrationDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [AnnouncementsIntegrationDeleteComponent],
        providers: [
          ModalService,
          {
            provide: MODAL_DATA,
            useValue: {
              onClose: () => {},
              data: mockIntegration
            }
          }
        ],
        imports: [CPTestModule]
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
