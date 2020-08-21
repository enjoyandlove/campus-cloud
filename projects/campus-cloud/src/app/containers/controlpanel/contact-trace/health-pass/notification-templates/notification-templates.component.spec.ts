import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplatesComponent } from './notification-templates.component';

describe('NotificationTemplatesComponent', () => {
  let component: NotificationTemplatesComponent;
  let fixture: ComponentFixture<NotificationTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
