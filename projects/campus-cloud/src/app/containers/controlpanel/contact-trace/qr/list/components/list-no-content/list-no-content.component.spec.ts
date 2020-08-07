import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrListNoContentComponent } from './list-no-content.component';

describe('QrListNoContentComponent', () => {
  let component: QrListNoContentComponent;
  let fixture: ComponentFixture<QrListNoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QrListNoContentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrListNoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
