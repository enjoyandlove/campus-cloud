import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { HealthPassComponent } from './health-pass.component';
import { mockHealthPass } from './tests/mock';
import { CPTestModule, configureTestSuite } from '@campus-cloud/shared/tests';
import { HealthPassService } from './health-pass.service';
import { HealthPassModule } from './health-pass.module';

describe('HealthPassComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [HealthPassComponent],
        imports: [CPTestModule, HealthPassModule],
        providers: [HealthPassService],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let session: CPSession;
  let component: HealthPassComponent;
  let fixture: ComponentFixture<HealthPassComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HealthPassComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    spyOn(component, 'handleError');
    spyOn(component.service, 'getHealthPass').and.returnValue(of(mockHealthPass));

    fixture.detectChanges();
  }));

  it('form validation should fail required fields missing', () => {
    component.form.controls['name-1'].setValue(null);

    expect(component.form.valid).toBe(false);
  });

  it('should update health pass', () => {
    spy = spyOn(component.service, 'updateHealthPass').and.returnValue(of({ mockHealthPass }));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.formErrors).toBe(false);
    expect(component.form.valid).toBe(true);
  });
});
