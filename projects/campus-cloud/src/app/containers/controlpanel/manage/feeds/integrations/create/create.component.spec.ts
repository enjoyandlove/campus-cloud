import { WallsIntegrationsService } from '../walls-integrations.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CPI18nService } from '@campus-cloud/shared/services';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as fromStore from '../store';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { WallsIntegrationsCreateComponent } from './create.component';
import { emptyForm, fillForm, resetForm, MockWallsIntegrationsService } from '../tests';
import { FeedIntegration } from '@campus-cloud/libs/integrations/common/model/integration.model';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers/integrations.utils.service';

describe('WallsIntegrationsCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [
          CPSession,
          provideMockStore(),
          CommonIntegrationUtilsService,
          CPI18nService,
          {
            provide: WallsIntegrationsService,
            useClass: MockWallsIntegrationsService
          }
        ],
        declarations: [WallsIntegrationsCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let session: CPSession;
  let tearDownSpy: jasmine.Spy;
  let formResetSpy: jasmine.Spy;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: WallsIntegrationsCreateComponent;

  let fixture: ComponentFixture<WallsIntegrationsCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationsCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
    formResetSpy = spyOn(component.form, 'reset');
  });

  it('should emit teardown event on reset', () => {
    component.resetModal();
    expect(tearDownSpy).toHaveBeenCalled();
    expect(formResetSpy).toHaveBeenCalled();
  });

  it('should call resetModal on close button click', () => {
    spyOn(component, 'resetModal');

    closeButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should return the valid integration types', () => {
    const resultTypes = component.typesDropdown.map((t) => t.action);
    const validTypeActions = [FeedIntegration.types.atom, FeedIntegration.types.rss];
    const resultContainsRightTypes = resultTypes.every((t: any) => validTypeActions.includes(t));

    expect(resultContainsRightTypes).toBe(true);
  });

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should create an empty form', () => {
    component.ngOnInit();

    const result = component.form.value;

    expect(result).toEqual(emptyForm);
  });

  it('should dispatch PostIntegration action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.PostIntegration(component.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.IntegrationActions.POST_INTEGRATION);
  });

  it('submit button should be disabled unless form is valid', () => {
    const de = fixture.debugElement;
    const submitBtn = de.query(By.css('.js_submit_button')).nativeElement;

    resetForm(component.form);

    expect(submitBtn.disabled).toBe(true);

    component.form.get('school_id').setValue(1);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);

    component.form.get('feed_url').setValue('mock');
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);
  });
});
