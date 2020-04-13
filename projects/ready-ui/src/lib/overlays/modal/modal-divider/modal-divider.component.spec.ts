import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDividerComponent } from './modal-divider.component';

describe('ModalDividerComponent', () => {
  let component: ModalDividerComponent;
  let fixture: ComponentFixture<ModalDividerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDividerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
