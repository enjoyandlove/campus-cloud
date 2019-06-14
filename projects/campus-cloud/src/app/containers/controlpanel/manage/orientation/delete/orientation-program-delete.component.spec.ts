import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { OrientationModule } from '../orientation.module';
import { OrientationService } from '../orientation.services';
import { MockOrientationService, mockPrograms } from '../tests';
import { CPI18nService, CPTrackingService, MODAL_DATA } from '@campus-cloud/shared/services';
import { OrientationProgramDeleteComponent } from './orientation-program-delete.component';

describe('OrientationProgramDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [OrientationModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          CPTrackingService,
          {
            provide: MODAL_DATA,
            useValue: {
              data: mockPrograms[0],
              onClose: () => {}
            }
          },
          { provide: OrientationService, useClass: MockOrientationService }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let search;
  let programId;
  let component: OrientationProgramDeleteComponent;
  let fixture: ComponentFixture<OrientationProgramDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationProgramDeleteComponent);
    component = fixture.componentInstance;

    component.orientationProgram = mockPrograms[0];

    component.session.g.set('school', mockSchool);
    programId = component.orientationProgram.id;
    search = new HttpParams().append('school_id', component.session.g.get('school').id.toString());
  }));

  it('should delete orientation program', () => {
    spy = spyOn(component.service, 'deleteProgram').and.returnValue(of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledWith(programId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
