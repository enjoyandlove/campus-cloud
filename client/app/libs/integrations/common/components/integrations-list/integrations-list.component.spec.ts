import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@app/session';
import { SharedModule } from '@shared/shared.module';
import { IntegrationsListComponent } from './integrations-list.component';
import { CommonIntegrationsModule } from './../../common-integrations.module';

describe('IntegrationsListComponent', () => {
  let component: IntegrationsListComponent;
  let fixture: ComponentFixture<IntegrationsListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CPSession],
        imports: [SharedModule, CommonIntegrationsModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
