import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { mockIntegration } from '../tests';
import { CPI18nService } from '@shared/services/i18n.service';
import { SharedModule } from '@campus-cloud/src/app/shared/shared.module';
import { WallsIntegrationsDeleteComponent } from './delete.component';
import { CPDeleteModalComponent } from '@shared/components/cp-delete-modal';

describe('WallsIntegrationsDeleteComponent', () => {
  let deleteModal: CPDeleteModalComponent;
  let component: WallsIntegrationsDeleteComponent;
  let fixture: ComponentFixture<WallsIntegrationsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [CPI18nService],
      declarations: [WallsIntegrationsDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationsDeleteComponent);
    component = fixture.componentInstance;

    component.integration = mockIntegration;
    deleteModal = fixture.debugElement.query(By.directive(CPDeleteModalComponent))
      .componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDelete on cp-modal deleteClick event', () => {
    spyOn(component, 'onDelete');

    deleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should call onResetModal on cp-modal cancelClick event', () => {
    spyOn(component, 'onResetModal');

    deleteModal.cancelClick.emit();

    expect(component.onResetModal).toHaveBeenCalled();
  });

  it('should emit deleteClick and teardown on onDelete', () => {
    spyOn(component.deleteClick, 'emit');
    spyOn(component.teardown, 'emit');

    component.onDelete();

    expect(component.deleteClick.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalled();
  });

  it('should emit teardown on onResetModal', () => {
    spyOn(component.teardown, 'emit');

    component.onResetModal();

    expect(component.teardown.emit).toHaveBeenCalled();
  });
});
