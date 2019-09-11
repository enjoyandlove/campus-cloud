import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestersDeleteComponent } from './testers-delete.component';
import { ModalService, MODAL_DATA } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('TestersDeleteComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [
          ModalService,
          {
            provide: MODAL_DATA,
            useValue: {
              data: 123,
              onClose: () => {},
              onAction: () => {}
            }
          }
        ],
        declarations: [TestersDeleteComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestersDeleteComponent;
  let fixture: ComponentFixture<TestersDeleteComponent>;
  let actionSpy;
  let closeSpy;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestersDeleteComponent);
    component = fixture.componentInstance;

    actionSpy = spyOn(component.modal, 'onAction');
    closeSpy = spyOn(component.modal, 'onClose');

    fixture.detectChanges();
  }));

  it('should delete', () => {
    component.doDelete();
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should cancel', () => {
    component.doCancel();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
