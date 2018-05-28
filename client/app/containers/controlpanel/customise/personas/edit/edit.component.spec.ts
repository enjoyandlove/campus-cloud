import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { PersonasUtilsService } from './../personas.utils.service';
import { PersonasService } from './../personas.service';
import { MockPersonasService, mockPersonas } from './../mock/personas.service.mock';
import { StoreModule } from '@ngrx/store';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { CPSession } from './../../../../../session/index';
import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { PersonasEditComponent } from './edit.component';

import { PersonasModule } from './../personas.module';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

describe('PersonasEditComponent', () => {
  let comp: PersonasEditComponent;
  let fixture: ComponentFixture<PersonasEditComponent>;

  beforeEach(
    async(() => {
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
    })
  );

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it(
    'fetch',
    fakeAsync(() => {
      const buildForm = spyOn(comp, 'buildForm');
      const buildHeader = spyOn(comp, 'buildHeader');

      comp.fetch();
      tick();

      expect(comp.persona).toEqual(mockPersonas[0]);
      expect(buildHeader).toHaveBeenCalled();
      expect(buildForm).toHaveBeenCalledWith(mockPersonas[0]);
    })
  );

  it('onDeleted', () => {
    spyOn(comp.router, 'navigate');

    comp.onDeleted();

    expect(comp.router.navigate).toHaveBeenCalledWith(['/customize/personas']);
  });

  it('onDeleteError', () => {
    const message = 'hello world';
    const expected = {
      type: SNACKBAR_SHOW,
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
    const expected = {
      school_id: 157,
      name: "Student's Tile",
      platform: 0,
      rank: 1,
      login_requirement: 1,
      pretour_enabled: false,
      cre_enabled: false,
      clone_tiles: null
    };

    comp.buildForm(mockPersonas[0]);

    fixture.detectChanges();

    expect(comp.form.value).toEqual(expected);
  });

  it('onFormValueChanges', () => {
    const validForm = new FormGroup({ ctrl: new FormControl(null) });

    comp.onFormValueChanges(validForm);

    expect(comp.submitButtonData.disabled).toBeFalsy();
  });

  it('onSubmit', () => {
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
