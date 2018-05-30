import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { CPSession } from './../../../../../session';
import { PersonasModule } from './../personas.module';
import { PersonasService } from './../personas.service';
import { PersonasCreateComponent } from './create.component';
import { CPDate } from './../../../../../shared/utils/date/date';
import { PersonasUtilsService } from './../personas.utils.service';
import { PersonasType, PersonasLoginRequired } from './../personas.status';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { MockPersonasService, mockPersonas } from './../mock/personas.service.mock';

describe('PersonasCreateComponent', () => {
  let comp: PersonasCreateComponent;
  let fixture: ComponentFixture<PersonasCreateComponent>;

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

      fixture = TestBed.createComponent(PersonasCreateComponent);
      comp = fixture.componentInstance;

      comp.session.g.set('school', { id: 157 });

      fixture.detectChanges();
    })
  );

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(comp, 'buildForm');
    spyOn(comp, 'buildHeader');

    comp.ngOnInit();

    expect(comp.buildForm).toHaveBeenCalled();
    expect(comp.buildHeader).toHaveBeenCalled();
  });

  it('form Validation', () => {
    expect(comp.form.valid).toBeFalsy();

    comp.form.controls['name'].setValue('a'.repeat(255));

    expect(comp.form.valid).toBeTruthy();

    comp.form.controls['name'].setValue('a'.repeat(256));

    expect(comp.form.valid).toBeFalsy();

    comp.form.controls['name'].setValue('');

    expect(comp.form.valid).toBeFalsy();
  });

  it('buildForm', () => {
    const expected = {
      school_id: 157,
      name: null,
      platform: PersonasType.mobile,
      rank: CPDate.now('America/Toronto').unix(),
      login_requirement: PersonasLoginRequired.optional,
      pretour_enabled: false,
      cre_enabled: false,
      clone_tiles: true
    };

    comp.buildForm();

    fixture.detectChanges();

    expect(comp.form.value).toEqual(expected);
  });

  it('onFormValueChanges', () => {
    const validForm = new FormGroup({ ctrl: new FormControl(null) });

    comp.onFormValueChanges(validForm);

    expect(comp.buttonData.disabled).toBeFalsy();
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

    comp.createForm.form = expectedForm;

    comp.onSubmit();
  });
});
