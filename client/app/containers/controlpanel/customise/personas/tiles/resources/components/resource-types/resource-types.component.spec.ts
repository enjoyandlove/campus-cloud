import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPSession } from '../../../../../../../../session';
import { PersonasResourceModule } from '../../resources.module';
import { TilesUtilsService } from '../../../tiles.utils.service';
import { mockPersonas } from '../../../../__mock__/personas.mock';
import { ResourcesUtilsService } from '../../resources.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';
import { SharedModule } from '../../../../../../../../shared/shared.module';
import { PersonasResourceTypesComponent } from './resource-types.component';
import { SectionUtilsService } from '../../../../sections/section.utils.service';

describe('PersonasResourceTypesComponent', () => {
  let comp: PersonasResourceTypesComponent;
  let fixture: ComponentFixture<PersonasResourceTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, PersonasResourceModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        TilesUtilsService,
        SectionUtilsService,
        ResourcesUtilsService
      ]
    });
    fixture = TestBed.createComponent(PersonasResourceTypesComponent);
    comp = fixture.componentInstance;
    comp.persona = mockPersonas[0];
  });
  it('should init properly', () => {
    comp.resourceSelection = 'academic_calendar';
    comp.ngOnInit();
    expect(comp.resources).toBeDefined();
    expect(comp.selectedItem).toBe(comp.resources[1]);
  });
});
