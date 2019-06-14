import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRoot from '@campus-cloud/store';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { CPNoContentComponent } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { MockActivatedRoute, mockIntegration } from '../tests';
import { ItemsIntegrationsListComponent } from './integrations-list.component';
import {
  IntegrationStatusPipe,
  IntegrationTypePipe
} from '@campus-cloud/libs/integrations/common/pipes';

describe('ItemsIntegrationsListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CPI18nService,
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ],
        declarations: [ItemsIntegrationsListComponent, IntegrationStatusPipe, IntegrationTypePipe],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );
  let session: CPSession;
  let dispatchSpy: jasmine.Spy;
  let fixture: ComponentFixture<ItemsIntegrationsListComponent>;
  let component: ItemsIntegrationsListComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsIntegrationsListComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    dispatchSpy = spyOn(component.store, 'dispatch');

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger success snackbar on action completed', () => {
    const someKey = 'some action';
    spyOn(component.store, 'select').and.returnValue(of(someKey));

    component.listenForCompletedActions();
    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload.class).toBe('success');
    expect(payload.body).toContain(someKey);
    expect(type).toBe(fromRoot.baseActions.SNACKBAR_SHOW);
  });

  it('should trigger danger snackbar on error', () => {
    spyOn(component.store, 'select').and.returnValue(of(true));

    component.listenForErrors();
    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload.class).toBe('danger');
    expect(type).toBe(fromRoot.baseActions.SNACKBAR_SHOW);
  });

  it('should show no results found message', () => {
    const de = fixture.debugElement;
    let noResultsFoundComp;

    component.loading$ = of(false);
    component.integrations$ = of([]);
    fixture.detectChanges();

    noResultsFoundComp = de.query(By.directive(CPNoContentComponent));

    expect(noResultsFoundComp).not.toBeNull();

    component.loading$ = of(false);
    component.integrations$ = of([mockIntegration]);
    fixture.detectChanges();

    noResultsFoundComp = de.query(By.directive(CPNoContentComponent));

    expect(noResultsFoundComp).toBeNull();
  });
});
