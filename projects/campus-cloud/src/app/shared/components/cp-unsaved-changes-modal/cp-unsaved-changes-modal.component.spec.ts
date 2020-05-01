import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPUnsavedChangesModalComponent } from './cp-unsaved-changes-modal.component';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

describe('CPUnsavedChangesModalComponent', () => {
  let component: CPUnsavedChangesModalComponent;
  let fixture: ComponentFixture<CPUnsavedChangesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        {
          provide: READY_MODAL_DATA,
          useValue: {
            cancel: () => {},
            discard: () => {}
          }
        }
      ],
      declarations: [CPUnsavedChangesModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPUnsavedChangesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
