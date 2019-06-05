import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import mockSection from './mock';
import { TilesService } from '../tiles.service';
import { CPSession } from '../../../../../../session';
import { PersonasTilesModule } from '../tiles.module';
import { PersonasService } from '../../personas.service';
import { TilesUtilsService } from '../tiles.utils.service';
import { PersonasTileEditComponent } from './edit.component';
import { mockPersonas } from '../../__mock__/personas.mock';
import { CPI18nService } from '../../../../../../shared/services';
import { SectionsService } from '../../sections/sections.service';
import { mockSchool } from '../../../../../../session/mock/school';
import { PersonasUtilsService } from '../../personas.utils.service';
import { baseActions } from '../../../../../../store/base/reducers';
import { SectionUtilsService } from '../../sections/section.utils.service';

class MockPersonaService {
  placeholder;

  getPersonaById(personaId, search) {
    this.placeholder = { personaId, search };

    return of(mockPersonas[0]);
  }
}

class MockSectionsService {
  _guide = mockSection;

  get guide() {
    return this._guide;
  }

  set guide(g) {
    this._guide = g;
  }
}

class MockTilService {
  placeholder;

  updateCampusLink(campusLinkId, data) {
    this.placeholder = { campusLinkId, data };

    return of({ id: campusLinkId });
  }
}

// function validCampusLinkForm(campusLinkForm: FormGroup) {
//   campusLinkForm.controls['name'].setValue('hello');
//   campusLinkForm.controls['link_url'].setValue('hello');
//   campusLinkForm.controls['link_params'].setValue({});
//   campusLinkForm.controls['img_url'].setValue('hello');
//   campusLinkForm.controls['school_id'].setValue('157');

//   return campusLinkForm;
// }

// function validCampusGuideTileForm(campusGuideTileForm: FormGroup) {
//   campusGuideTileForm.controls['school_id'].setValue(157);
//   campusGuideTileForm.controls['school_persona_id'].setValue(1);
//   campusGuideTileForm.controls['name'].setValue('hello');
//   campusGuideTileForm.controls['rank'].setValue(1);
//   campusGuideTileForm.controls['img_url'].setValue('img_url');
//   campusGuideTileForm.controls['color'].setValue('cccccc');
//   campusGuideTileForm.controls['featured_rank'].setValue(1);

//   return campusGuideTileForm;
// }

describe('PersonasTileEditComponent', () => {
  let guideService: SectionsService;
  let personaService: PersonasService;
  let component: PersonasTileEditComponent;
  let fixture: ComponentFixture<PersonasTileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PersonasTilesModule, RouterTestingModule, StoreModule.forRoot({})],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        TilesUtilsService,
        SectionUtilsService,
        SectionUtilsService,
        PersonasUtilsService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { tileId: mockSection.tiles[0].id } } }
        },
        { provide: TilesService, useClass: MockTilService },
        { provide: SectionsService, useClass: MockSectionsService },
        { provide: PersonasService, useClass: MockPersonaService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PersonasTileEditComponent);
        component = fixture.componentInstance;

        component.personaId = 1;
        component.session.g.set('school', mockSchool);
        guideService = TestBed.get(SectionsService);
        personaService = TestBed.get(PersonasService);
      });
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if no guide is set', () => {
    const routerSpy = spyOn(component.router, 'navigate');
    spyOn(component, 'fetch');

    guideService.guide = null;

    fixture.detectChanges();

    expect(component.fetch).not.toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/studio/experiences/', component.personaId]);
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should set guide from guideService', () => {
    spyOn(component.router, 'navigate');
    spyOn(component, 'fetch');

    fixture.detectChanges();

    expect(component.fetch).toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('should catch fetch error', fakeAsync(() => {
    spyOn(component, 'erroHandler');
    spyOn(component.personaService, 'getPersonaById').and.returnValue(
      of(new HttpErrorResponse({ error: 'Mocked Error' }))
    );

    component.fetch();
    tick();

    expect(component.erroHandler).toHaveBeenCalled();
  }));

  it('should fetch personaById', fakeAsync(() => {
    fixture.detectChanges();

    const params = new HttpParams().set('school_id', component.session.g.get('school').id);

    spyOn(component, 'erroHandler');
    spyOn(personaService, 'getPersonaById').and.returnValue(of(mockPersonas[0]));

    component.fetch();
    tick();

    expect(component.campusLinkForm).toBeDefined();
    expect(component.campusGuideTileForm).toBeDefined();
    expect(component.erroHandler).not.toHaveBeenCalled();
    expect(component.persona).toEqual(mockPersonas[0]);
    expect(personaService.getPersonaById).toHaveBeenCalledWith(component.personaId, params);
  }));

  it('should update buttonData based on form validity', () => {
    fixture.detectChanges();
    component.buildForm();
    component.updateButtonDisableStatus();

    expect(component.buttonData.disabled).toBe(false);

    component.campusLinkForm.controls['link_url'].setValue(null);
    component.updateButtonDisableStatus();
    expect(component.buttonData.disabled).toBe(true);

    component.campusLinkForm.controls['link_url'].setValue('a value');
    component.updateButtonDisableStatus();
    expect(component.buttonData.disabled).toBe(false);

    component.campusGuideTileForm.controls['name'].setValue(null);
    component.updateButtonDisableStatus();
    expect(component.buttonData.disabled).toBe(true);

    component.campusGuideTileForm.controls['name'].setValue('some');
    component.updateButtonDisableStatus();
    expect(component.buttonData.disabled).toBe(false);
  });

  it('should call updateButtonDisableStatus', () => {
    fixture.detectChanges();
    component.buildForm();
    spyOn(component, 'updateButtonDisableStatus');

    component.onCampusLinkFormChange({});

    expect(component.updateButtonDisableStatus).toHaveBeenCalled();
  });

  it('should update linkForm with guide tile form values', () => {
    fixture.detectChanges();
    component.buildForm();
    spyOn(component, 'updateButtonDisableStatus');

    const linkForm = component.campusLinkForm;
    const guideTileForm = component.campusGuideTileForm;

    guideTileForm.controls['name'].setValue('some');
    guideTileForm.controls['img_url'].setValue('test');

    component.onCampusGuideTileFormChange();

    expect(linkForm.controls['name'].value).toBe('some');
    expect(linkForm.controls['img_url'].value).toBe('test');
    expect(component.updateButtonDisableStatus).toHaveBeenCalled();
  });

  it('should reset both forms', () => {
    fixture.detectChanges();
    component.buildForm();

    spyOn(component.campusLinkForm, 'reset');
    spyOn(component.campusGuideTileForm, 'reset');

    component.doReset();

    expect(component.campusLinkForm.reset).toHaveBeenCalled();
    expect(component.campusGuideTileForm.reset).toHaveBeenCalled();
  });

  it('should create forms', () => {
    expect(component.campusLinkForm).not.toBeDefined();
    expect(component.campusGuideTileForm).not.toBeDefined();

    fixture.detectChanges();
    component.buildForm();

    expect(component.campusLinkForm).toBeDefined();
    expect(component.campusGuideTileForm).toBeDefined();
    expect(component.editable).toBe(true);
  });

  it('should set editable false', () => {
    component.route.snapshot.params.tileId = 12942;
    fixture.detectChanges();
    component.buildForm();

    expect(component.editable).toBe(false);
  });

  it('should display alert snackbar', () => {
    const spy = spyOn(component.store, 'dispatch');

    component.erroHandler();

    expect(component.store.dispatch).toHaveBeenCalled();

    const args = spy.calls.mostRecent().args[0] as any;

    expect(args.payload.class).toBe('danger');
    expect(args.type).toBe(baseActions.SNACKBAR_SHOW);
  });
});
