import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplatesComponent } from './notification-templates.component';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

describe('NotificationTemplatesComponent', () => {
  let component: NotificationTemplatesComponent;
  let fixture: ComponentFixture<NotificationTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTemplatesComponent ],
      imports: [CPTestModule],
      providers: [CPI18nPipe],
      schemas: [NO_ERRORS_SCHEMA]
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
