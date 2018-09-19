import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { reducers } from './../../../../../../reducers';
import { CPSession } from './../../../../../../session/index';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { mockPersonas } from './../../mock/personas.service.mock';
import { PersonasService } from './../../personas.service';
import { SectionUtilsService } from './../../sections/section.utils.service';
import { SectionsService } from './../../sections/sections.service';
import { PersonasTilesModule } from './../tiles.module';
import { TilesService } from './../tiles.service';
import { PersonasTileCreateComponent } from './create.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SNACKBAR_HIDE } from '../../../../../../reducers/snackbar.reducer';

class MockPersonasService {
  dummy;

  getPersonaById(personaId, search) {
    this.dummy = { personaId, search };

    return of(mockPersonas[0]);
  }
}

class MockSectionsService {
  _guide = {
    name: 'UNTITLED',
    rank: 1,
    tiles: []
  };

  set guide(guide) {
    this._guide = guide;
  }

  get guide() {
    return this._guide;
  }
}

class MockTilesService {
  dummy;

  createCampusLink(formValue) {
    this.dummy = formValue;

    return of({
      id: 1,
      ...formValue
    });
  }

  createCampusTile(data) {
    this.dummy = data;

    return of(data);
  }
}

describe('PersonasTileCreateComponent', () => {
  let comp: PersonasTileCreateComponent;
  let fixture: ComponentFixture<PersonasTileCreateComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          PersonasTilesModule,
          SharedModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPI18nService,
          FormBuilder,
          CPSession,
          SectionUtilsService,
          SectionUtilsService,
          { provide: TilesService, useClass: MockTilesService },
          { provide: PersonasService, useClass: MockPersonasService },
          { provide: SectionsService, useClass: MockSectionsService }
        ],
        declarations: []
      });
      fixture = TestBed.createComponent(PersonasTileCreateComponent);
      comp = fixture.componentInstance;

      comp.personaId = 1;
      comp.session.g.set('school', { id: 157 });

      fixture.detectChanges();
    })
  );

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect(comp.buttonData.disabled).toBeTruthy();
  });

  it('should redirect if no guide has been set', () => {
    spyOnProperty(comp.guideService, 'guide', 'get').and.returnValue(null);
    spyOn(comp.router, 'navigate').and.returnValue(Promise.resolve());

    const expected = ['/studio/experiences/', comp.personaId];

    comp.ngOnInit();

    expect(comp.router.navigate).toHaveBeenCalled();
    expect(comp.router.navigate).toHaveBeenCalledWith(expected);
  });

  it(
    'fetch',
    fakeAsync(() => {
      spyOn(comp.personaService, 'getPersonaById').and.callThrough();
      spyOn(comp, 'buildForm');
      spyOn(comp, 'buildHeader');

      comp.fetch();

      expect(comp.personaService.getPersonaById).toHaveBeenCalled();

      tick();

      expect(comp.campusLinkForm).toBeDefined();
      expect(comp.campusGuideTileForm).toBeDefined();

      expect(comp.buildForm).toHaveBeenCalled();
      expect(comp.buildHeader).toHaveBeenCalled();
    })
  );

  it(
    'fetch with errors',
    fakeAsync(() => {
      spyOn(comp, 'erroHandler');
      spyOn(comp, 'buildForm');
      spyOn(comp, 'buildHeader');
      spyOn(comp.personaService, 'getPersonaById').and.returnValue(
        throwError(new HttpErrorResponse({ error: 'error' }))
      );

      comp.fetch();

      tick();

      expect(comp.buildForm).not.toHaveBeenCalled();
      expect(comp.buildHeader).not.toHaveBeenCalled();
      expect(comp.erroHandler).toHaveBeenCalled();
    })
  );

  it('should show snackbar on erroHandler', () => {
    spyOn(comp.store, 'dispatch');

    comp.erroHandler();

    expect(comp.store.dispatch).toHaveBeenCalled();
  });

  it('should destroy', () => {
    spyOn(comp.store, 'dispatch');

    expect(comp.ngOnDestroy).toBeDefined();

    comp.ngOnDestroy();

    expect(comp.guideService.guide).toBeNull();
    expect(comp.store.dispatch).toHaveBeenCalled();
    expect(comp.store.dispatch).toHaveBeenCalledWith({ type: SNACKBAR_HIDE });
  });

  it('createGuideLink', () => {
    const expected = {
      school_id: 157,
      school_persona_id: 1,
      name: null,
      rank: 1,
      img_url: null,
      color: 'FFFFFF',
      extra_info: { id: 1 },
      visibility_status: 1,
      tile_category_id: 1,
      featured_rank: -1
    };
    comp.createGuideLink(1).subscribe((result) => expect(result).toEqual(expected));
  });

  it('doReset', () => {
    const spyOnCampusLinkForm = spyOn(comp.campusLinkForm, 'reset');
    const spyOnCampusGuideTileForm = spyOn(comp.campusGuideTileForm, 'reset');

    comp.doReset();

    expect(spyOnCampusLinkForm).toHaveBeenCalled();
    expect(spyOnCampusGuideTileForm).toHaveBeenCalled();
  });

  it('updateSubmitState', () => {
    comp.updateSubmitState();

    expect(comp.buttonData.disabled).toBeTruthy();

    Object.keys(comp.campusGuideTileForm.value).forEach((key) =>
      comp.campusGuideTileForm.controls[key].setValue(1)
    );

    comp.updateSubmitState();

    expect(comp.buttonData.disabled).toBeTruthy();

    Object.keys(comp.campusLinkForm.value).forEach((key) =>
      comp.campusLinkForm.controls[key].setValue(1)
    );

    comp.updateSubmitState();

    expect(comp.buttonData.disabled).toBeFalsy();
  });

  it('onCampusGuideTileFormChange', () => {
    const [name, image] = ['name', 'image'];

    spyOn(comp, 'updateSubmitState');

    comp.campusGuideTileForm.controls['name'].setValue(name);
    comp.campusGuideTileForm.controls['img_url'].setValue(image);

    comp.onCampusGuideTileFormChange();

    const campusLinkFormName = comp.campusLinkForm.controls['name'].value;
    const campusLinkFormImage = comp.campusLinkForm.controls['img_url'].value;

    expect(comp.updateSubmitState).toHaveBeenCalled();

    expect(campusLinkFormName).toBe(name);
    expect(campusLinkFormImage).toBe(image);
  });

  it('onCampusLinkFormChange', () => {
    spyOn(comp, 'updateSubmitState');

    comp.onCampusLinkFormChange();

    expect(comp.updateSubmitState).toHaveBeenCalled();
  });
});
