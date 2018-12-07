import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared/shared.module';
import { IntegrationsActionBoxComponent } from './integrations-action-box.component';

describe('IntegrationsActionBoxComponent', () => {
  let component: IntegrationsActionBoxComponent;
  let fixture: ComponentFixture<IntegrationsActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [IntegrationsActionBoxComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsActionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
