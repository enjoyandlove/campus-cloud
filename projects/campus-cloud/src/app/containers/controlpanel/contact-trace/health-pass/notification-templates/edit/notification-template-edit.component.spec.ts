import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateEditComponent } from './notification-template-edit.component';

describe('NotificationTemplateEditComponent', () => {
  let component: NotificationTemplateEditComponent;
  let fixture: ComponentFixture<NotificationTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
