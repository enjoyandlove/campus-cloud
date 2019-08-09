import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';

import { mockResource } from '../../__mock__';
import { TilesService } from '../../../tiles.service';
import { ResourceService } from '../../resource.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { PersonasResourceModule } from '../../resources.module';
import { mockPersonas } from '@controlpanel/customise/personas/tests';
import { PersonasResourceListOfListComponent } from './resource-list-of-list.component';

describe('PersonasResourceListOfListComponent', () => {
  let comp: PersonasResourceListOfListComponent;
  let fixture: ComponentFixture<PersonasResourceListOfListComponent>;

  const resource = { ...mockResource };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, HttpClientModule, RouterTestingModule, PersonasResourceModule],
      providers: [provideMockStore(), ResourceService, TilesService]
    });
    fixture = TestBed.createComponent(PersonasResourceListOfListComponent);
    comp = fixture.componentInstance;
    comp.persona = mockPersonas[0];
  });

  it('should not edit deprecated link', () => {
    comp.ngOnInit();
    comp.onEditModal({ ...resource });
    expect(comp.state.showEditModal).toBe(false);

    comp.onEditModal({
      ...resource,
      link_url: 'oohlala://academic_calendar_list'
    });
    expect(comp.state.showEditModal).toBe(true);
  });

  it('should update resource', () => {
    comp.ngOnInit();
    comp.state.resources = [{ ...resource }];
    comp.onEditedResource({ ...resource, name: 'edited' });
    expect(comp.state.resources.find((res) => resource.id === res.id).name).toBe('edited');
  });
});
