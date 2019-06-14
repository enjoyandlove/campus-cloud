import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { omit } from 'lodash';

import * as fromStore from '../store';

import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { CPI18nService } from '@app/shared/services';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { WallsIntegrationsEditComponent } from './edit.component';
import { WallsIntegrationsService } from '../walls-integrations.service';
import { FeedIntegration } from '@libs/integrations/common/model/integration.model';
import { fillForm, resetForm, MockWallsIntegrationsService, mockIntegration } from '../tests';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers/integrations.utils.service';

describe('WallsIntegrationsEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CommonIntegrationUtilsService,
          CPI18nService,
          {
            provide: WallsIntegrationsService,
            useClass: MockWallsIntegrationsService
          }
        ],
        declarations: [WallsIntegrationsEditComponent],
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
  let component: WallsIntegrationsEditComponent;

  let fixture: ComponentFixture<WallsIntegrationsEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationsEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    component.integration = mockIntegration;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
    formResetSpy = spyOn(component.form, 'reset');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
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

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should create form with values form integration input', () => {
    component.ngOnInit();

    const result = component.form.getRawValue();

    // remove readonly fields
    const expected = omit(component.integration, [
      'id',
      'sync_status',
      'last_successful_sync_epoch'
    ]);
    expect(result).toEqual(expected);
  });

  it('should dispatch EditIntegration action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');
    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.EditIntegration(component.form.getRawValue());

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.IntegrationActions.EDIT_INTEGRATION);
  });

  it('should return the valid integration types', () => {
    const resultTypes = component.typesDropdown.map((t) => t.action);
    const validTypeActions = [FeedIntegration.types.atom, FeedIntegration.types.rss];
    const resultContainsRightTypes = resultTypes.every((t: any) => validTypeActions.includes(t));

    expect(resultContainsRightTypes).toBe(true);
  });

  it('should disable a few controls on form init', () => {
    const disabledControls = ['feed_url', 'feed_type', 'social_post_category_id'];

    disabledControls.forEach((ctrName) => {
      expect(component.form.get(ctrName).disabled).toBe(true);
    });
  });

  it('submit button should be disabled unless form is valid', () => {
    const de = fixture.debugElement;
    const submitBtn = de.query(By.css('.js_submit_button')).nativeElement;

    resetForm(component.form);
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);

    component.form.get('school_id').setValue(1);
    component.form.get('poster_avatar_url').setValue('some');
    component.form.get('poster_display_name').setValue('some');

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
  });
});
