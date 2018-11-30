import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';

import { EventIntegration } from '../model';
import { mockEventIntegration } from '../tests';
import { CPSession } from './../../../../../../session';
import { configureTestSuite } from '../../../../../../shared/tests';
import { mockSchool } from './../../../../../../session/mock/school';
import { SharedModule } from './../../../../../../shared/shared.module';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { EventsIntegrationsDeleteComponent } from './integrations-delete.component';

describe('EventsIntegrationsDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({}), RouterModule.forRoot([])],
        providers: [CPSession, CPI18nService],
        declarations: [EventsIntegrationsDeleteComponent]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let session: CPSession;
  let tearDownSpy: jasmine.Spy;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: EventsIntegrationsDeleteComponent;

  let fixture: ComponentFixture<EventsIntegrationsDeleteComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsIntegrationsDeleteComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    component.eventIntegration = new EventIntegration({ ...mockEventIntegration });

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should emit teardown event on reset', () => {
    component.resetModal();
    expect(tearDownSpy).toHaveBeenCalled();
  });

  it('should call resetModal on close button click', () => {
    spyOn(component, 'resetModal');

    closeButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should dispatch DeleteIntegration action', () => {
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.onDelete();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { params, integrationId } = payload;
    const expectedParams = new HttpParams().set('school_id', <any>mockSchool.id);

    expect(params).toEqual(expectedParams);
    expect(integrationId).toBe(mockEventIntegration.id);
    expect(type).toBe(fromStore.IntegrationActions.DELETE_INTEGRATION);
  });
});
