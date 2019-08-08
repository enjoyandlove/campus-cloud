import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import * as fromFeature from '../store';
import * as fromRoot from '@campus-cloud/store';

import { mockIntegration } from '../tests';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { WallsIntegrationsListComponent } from './list.component';
import { CPNoContentComponent } from '@campus-cloud/shared/components';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';
import { LibsWallsIntegrationsModule } from '@campus-cloud/libs/integrations/walls/walls-integrations.module';

describe('WallsIntegrationsListComponent', () => {
  let session: CPSession;
  let dispatchSpy: jasmine.Spy;
  let component: WallsIntegrationsListComponent;
  let fixture: ComponentFixture<WallsIntegrationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPSession, CPI18nService],
      imports: [
        CommonIntegrationsModule,
        SharedModule,
        LibsWallsIntegrationsModule,
        StoreModule.forRoot(
          {
            ...fromRoot.baseReducers,
            wallsIntegrations: combineReducers(fromFeature.reducers)
          },
          { runtimeChecks: {} }
        )
      ],
      declarations: [WallsIntegrationsListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationsListComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    dispatchSpy = spyOn(component.store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
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
