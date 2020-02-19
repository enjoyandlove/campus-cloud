import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPNoContentComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { AssessUtilsService } from '@controlpanel/assess/assess.utils.service';
import { StudentsService } from '@controlpanel/assess/students/students.service';
import { EngagementStudentsModule } from '@controlpanel/assess/students/students.module';
import { StudentsListComponent } from '@controlpanel/assess/students/list/students-list.component';

class MockStudentsService {
  getStudentsByList() {
    return of([]);
  }

  getLists() {
    return of([]);
  }

  getExperiences() {
    return of([]);
  }
}

describe('StudentsListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [
          provideMockStore({}),
          AssessUtilsService,
          { provide: StudentsService, useClass: MockStudentsService }
        ],
        imports: [CPTestModule, EngagementStudentsModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let session: CPSession;
  let service: StudentsService;
  let component: StudentsListComponent;
  let fixture: ComponentFixture<StudentsListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StudentsListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    session = TestBed.get(CPSession);
    service = TestBed.get(StudentsService);

    session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  it('should show No Content component if no students are returned', () => {
    component.loading = false;
    fixture.detectChanges();
    const noContent = de.query(By.directive(CPNoContentComponent));

    expect(noContent).not.toBeNull();
  });

  it('should not show No Content component when students are returned', () => {
    spyOn(service, 'getStudentsByList').and.returnValue(of([{ id: 1, first_name: 'Some' }]));

    component.fetch();
    component.loading = false;

    const noContent = de.query(By.directive(CPNoContentComponent));

    expect(noContent).toBeNull();
  });
});
