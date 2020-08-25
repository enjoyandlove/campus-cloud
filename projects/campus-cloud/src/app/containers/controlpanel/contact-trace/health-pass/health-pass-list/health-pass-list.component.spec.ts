import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPassListComponent } from './health-pass-list.component';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HealthPassListComponent', () => {
  let component: HealthPassListComponent;
  let fixture: ComponentFixture<HealthPassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthPassListComponent ],
      imports: [CPTestModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthPassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
