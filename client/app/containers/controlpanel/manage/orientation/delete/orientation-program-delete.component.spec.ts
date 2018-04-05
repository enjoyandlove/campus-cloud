import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { OrientationModule } from '../orientation.module';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { OrientationProgramDeleteComponent } from './orientation-program-delete.component';

class MockOrientationService {
  dummy;
  deleteProgram(programId: number, search: any) {
    this.dummy = [programId, search];

    return Observable.of({});
  }
}

describe('OrientationProgramDeleteComponent', () => {
  let spy;
  let search;
  let programId;
  let component: OrientationProgramDeleteComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrientationModule],
      providers: [
        CPSession,
        CPI18nService,
        { provide: OrientationService, useClass: MockOrientationService },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationProgramDeleteComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);

      search = new URLSearchParams();
      component.orientationProgram = {
        id: 84,
        name: 'Hello World',
        description: 'This is description'
      };

      component.session.g.set('school', mockSchool);
      programId = component.orientationProgram.id;
      search.append('school_id', component.session.g.get('school').id.toString());
    });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete orientation program', () => {
    spy = spyOn(component.service, 'deleteProgram').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledWith(programId, search);
    expect(spy.calls.count()).toBe(1);
  });

});
