import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { MockPersonasService } from './../tests';
import { PersonasModule } from './../personas.module';
import { PersonasService } from './../personas.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { PersonasCreateComponent } from './create.component';
import { PersonasUtilsService } from './../personas.utils.service';

describe('PersonasCreateComponent', () => {
  let comp: PersonasCreateComponent;
  let fixture: ComponentFixture<PersonasCreateComponent>;

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

    fixture = TestBed.createComponent(PersonasCreateComponent);
    comp = fixture.componentInstance;

    comp.session.g.set('school', { id: 157 });

    fixture.detectChanges();
  }));

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

  it('onSecurityServiceChanged', () => {
    let mock = {};
    const fakeService = { id: 1, name: 'fake service' };

    mock = {
      label: 'dummy',
      value: null
    };

    comp.onSecurityServiceChanged(mock);

    expect(comp.campusSecurityTile).toBeNull();

    mock = {
      ...mock,
      meta: { ...fakeService }
    };

    comp.onSecurityServiceChanged(mock);

    expect(comp.campusSecurityTile).toEqual(fakeService);
  });

  it('buildForm', () => {
    const expected = comp.utils.getPersonasForm().value;

    comp.buildForm();

    fixture.detectChanges();

    expect(comp.form.value).toEqual(expected);
  });

  it('onFormValueChanges', () => {
    const validForm = new FormGroup({ ctrl: new FormControl(null) });

    comp.onFormValueChanges(validForm);

    expect(comp.buttonData.disabled).toBeFalsy();
  });

  it('getCampusLinkForm', () => {
    const fakeService = { id: 1, name: 'name', img_url: 'image' };

    const expected = {
      description: null,
      img_url: 'image',
      is_system: 1,
      link_params: { id: 1 },
      link_url: 'oohlala://campus_security_service',
      name: 'name',
      open_in_browser: 0,
      school_id: 157
    };

    comp.campusSecurityTile = fakeService;

    const result = comp.getCampusLinkForm();

    expect(result).toEqual(expected);
  });

  it('createCampusTile', () => {
    const fakeService = { id: 1, name: 'name', img_url: 'image' };
    comp.campusSecurityTile = fakeService;

    const expected = {
      id: 1,
      color: 'FFFFFF',
      description: null,
      featured_rank: 0,
      img_url: null,
      school_id: 157,
      extra_info: { id: 1 },
      school_persona_id: 3,
      tile_category_id: 0,
      visibility_status: 1,
      name: 'name',
      rank: -1
    };

    comp.createCampusTile(1, 3).subscribe((result) => {
      expect(result).toEqual(expected);
    });
  });

  it('createSecurityTile', () => {
    const fakeService = { id: 1, name: 'name', img_url: 'image' };
    comp.campusSecurityTile = fakeService;

    const spyOncreateCampusTile = spyOn(comp, 'createCampusTile').and.returnValue(of({ id: 1 }));

    comp.createSecurityTile(1).subscribe(() => {
      expect(spyOncreateCampusTile).toHaveBeenCalledTimes(1);
    });
  });
});
