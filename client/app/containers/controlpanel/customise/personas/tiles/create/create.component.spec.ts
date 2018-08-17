import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
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

class MockTilesService {}

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
