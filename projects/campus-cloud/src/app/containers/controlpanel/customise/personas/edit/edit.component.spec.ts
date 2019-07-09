import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { mockTile } from '../tiles/tests/mocks';
import { CPSession } from '@campus-cloud/session';
import { PersonasModule } from './../personas.module';
import { baseActions } from '@campus-cloud/store/base';
import { PersonasService } from './../personas.service';
import { PersonasEditComponent } from './edit.component';
import { CPI18nService } from '@campus-cloud/shared/services';
import { MockPersonasService, mockPersonas } from './../tests';
import { PersonasUtilsService } from './../personas.utils.service';

describe('PersonasEditComponent', () => {
  let comp: PersonasEditComponent;
  let fixture: ComponentFixture<PersonasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PersonasModule, RouterTestingModule, StoreModule.forRoot({})],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        PersonasUtilsService,
        { provide: PersonasService, useClass: MockPersonasService }
      ]
    });

    fixture = TestBed.createComponent(PersonasEditComponent);
    comp = fixture.componentInstance;

    comp.session.g.set('school', { id: 157 });
    comp.personaId = 1;

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('fetch', fakeAsync(() => {
    spyOn(comp, 'getCampusSecurity').and.returnValue(Promise.resolve(mockTile));
    const buildForm = spyOn(comp, 'buildForm');
    const buildHeader = spyOn(comp, 'buildHeader');

    comp.fetch();
    tick();

    expect(comp.persona).toEqual(mockPersonas[0]);

    expect(buildHeader).toHaveBeenCalled();
    expect(buildHeader).toHaveBeenCalledTimes(1);

    expect(buildForm).toHaveBeenCalledWith(mockPersonas[0]);
    expect(buildForm).toHaveBeenCalledTimes(1);
  }));

  it('form Validation', () => {
    comp.buildForm(mockPersonas[0]);

    expect(comp.form.valid).toBeTruthy();

    comp.form.controls['name'].setValue('a'.repeat(255));

    expect(comp.form.valid).toBeTruthy();

    comp.form.controls['name'].setValue('a'.repeat(256));

    expect(comp.form.valid).toBeFalsy();

    comp.form.controls['name'].setValue('');

    expect(comp.form.valid).toBeFalsy();
  });

  it('onDeleted', () => {
    spyOn(comp.router, 'navigate');

    comp.onDeleted();

    expect(comp.router.navigate).toHaveBeenCalledWith(['/studio/experiences']);
  });

  it('onDeleteError', () => {
    const message = 'hello world';
    const expected = {
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: message
      }
    };

    spyOn(comp.store, 'dispatch');

    comp.onDeleteError(message);

    expect(comp.store.dispatch).toHaveBeenCalledWith(expected);
  });

  it('buildForm', () => {
    const expected = comp.utils.getPersonasForm(mockPersonas[0]).value;

    comp.buildForm(mockPersonas[0]);

    fixture.detectChanges();

    expect(comp.form.value).toEqual(expected);
  });

  it('onFormValueChanges', () => {
    const validForm = new FormGroup({ ctrl: new FormControl(null) });

    comp.onFormValueChanges(validForm);

    expect(comp.submitButtonData.disabled).toBeFalsy();
  });

  xit('onSubmit', () => {
    fixture.detectChanges();

    const persona = mockPersonas[0];

    const fb = new FormBuilder();

    const expectedForm = fb.group({
      school_id: [157, Validators.required],
      name: [persona.localized_name_map.en, [Validators.required, Validators.maxLength(255)]],
      platform: [persona.platform, Validators.required],
      rank: [persona.rank, Validators.required],
      login_requirement: [persona.login_requirement],
      pretour_enabled: [persona.pretour_enabled],
      cre_enabled: [persona.cre_enabled],
      clone_tiles: [true]
    });

    comp.editForm.form = expectedForm;

    comp.onSubmit();
  });
});
