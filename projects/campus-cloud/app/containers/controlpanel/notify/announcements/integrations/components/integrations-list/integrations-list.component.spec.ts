import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockIntegration, mockSender } from '../../tests';
import { IntegrationsListComponent } from './integrations-list.component';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';

describe('IntegrationsListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [IntegrationsListComponent],
        providers: [CPSession, CPI18nService],
        imports: [SharedModule, CommonIntegrationsModule, HttpClientTestingModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let component: IntegrationsListComponent;
  let fixture: ComponentFixture<IntegrationsListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IntegrationsListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display integrations in list', () => {
    let listItems: DebugElement[];
    const listItem = '.cp-form__item';

    listItems = de.queryAll(By.css(listItem));

    expect(listItems.length).toBe(0);

    component.senders = [mockSender];
    component.integrations$ = of([mockIntegration]);
    fixture.detectChanges();

    listItems = de.queryAll(By.css(listItem));
    expect(listItems.length).toBe(1);
  });
});
