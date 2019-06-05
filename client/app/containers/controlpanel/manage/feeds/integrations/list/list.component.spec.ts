import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import * as fromRoot from '@app/store';
import * as fromFeature from '../store';

import { CPSession } from '@app/session';
import { mockIntegration } from '../tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { CPNoContentComponent } from '@shared/components';
import { CPI18nService } from '@shared/services/i18n.service';
import { WallsIntegrationsListComponent } from './list.component';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { LibsWallsIntegrationsModule } from '@libs/integrations/walls/walls-integrations.module';

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
        StoreModule.forRoot({
          ...fromRoot.baseReducers,
          wallsIntegrations: combineReducers(fromFeature.reducers)
        })
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
