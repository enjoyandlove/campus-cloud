import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { of } from 'rxjs';
import { mockResource } from '../__mock__';
import { ResourceService } from '../resource.service';
import { CPSession } from '../../../../../../../session';
import { PersonasResourceModule } from '../resources.module';
import { TilesUtilsService } from '../../tiles.utils.service';
import { PersonaResourceEditComponent } from './edit.component';
import { ResourcesUtilsService } from '../resources.utils.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { SectionUtilsService } from '../../../sections/section.utils.service';

class MockResourceService {
  dummy;

  updateCampusLink(id, body) {
    this.dummy = { id, body };

    return of(id);
  }
}

describe('PersonaResourceEditComponent', () => {
  let comp: PersonaResourceEditComponent;
  let fixture: ComponentFixture<PersonaResourceEditComponent>;

  const resource = { ...mockResource };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, PersonasResourceModule, HttpClientModule],
      providers: [
        CPSession,
        CPI18nService,
        TilesUtilsService,
        SectionUtilsService,
        ResourcesUtilsService,
        {
          provide: ResourceService,
          useClass: MockResourceService
        }
      ]
    });
    fixture = TestBed.createComponent(PersonaResourceEditComponent);
    comp = fixture.componentInstance;
    comp.resource = { ...resource };
  });

  it('should init form values', () => {
    comp.ngOnInit();
    expect(comp.campusLinkForm.get('link_url').value).toBe('oohlala://camera_qr');
  });

  it('should submit update', fakeAsync(() => {
    spyOn(comp.success, 'emit');
    comp.ngOnInit();
    comp.onSubmit();
    tick();
    expect(comp.success.emit).toHaveBeenCalledTimes(1);
  }));
});
