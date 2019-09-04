import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockTile } from '../tiles/tests/mocks';
import { PersonasModule } from './../personas.module';
import { baseActions } from '@campus-cloud/store/base';
import { PersonasService } from './../personas.service';
import { PersonasEditComponent } from './edit.component';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { MockPersonasService, mockPersonas } from './../tests';
import { PersonasUtilsService } from './../personas.utils.service';

describe('PersonasEditComponent', () => {
  let comp: PersonasEditComponent;
  let fixture: ComponentFixture<PersonasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PersonasModule, RouterTestingModule, CPTestModule],
      providers: [
        FormBuilder,
        provideMockStore(),
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

  it('doAction', () => {
    spyOn(comp, 'onDeleteError');
    spyOn(comp.router, 'navigate');

    comp.doAction(null);

    expect(comp.router.navigate).toHaveBeenCalledWith(['/studio/experiences']);

    comp.doAction('some error');

    expect(comp.onDeleteError).toHaveBeenCalled();
    expect(comp.onDeleteError).toHaveBeenCalledWith('some error');
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
});
