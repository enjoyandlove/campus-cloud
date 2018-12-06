import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsDeleteComponent } from './integrations-delete.component';

describe('IntegrationsDeleteComponent', () => {
  let component: IntegrationsDeleteComponent;
  let fixture: ComponentFixture<IntegrationsDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IntegrationsDeleteComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
