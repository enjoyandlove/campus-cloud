import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDuplicateComponent } from './form-duplicate.component';

describe('FormDuplicateComponent', () => {
  let component: FormDuplicateComponent;
  let fixture: ComponentFixture<FormDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
