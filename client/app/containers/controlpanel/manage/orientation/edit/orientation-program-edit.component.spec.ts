/*tslint:disable:max-line-length*/
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services/i18n.service';
import { OrientationDetailsModule } from '../details/orientation-details.module';
import { OrientationProgramEditComponent } from './orientation-program-edit.component';

class MockOrientationService {
  dummy;

  editProgram(programId: number, body: any, search: any) {
    this.dummy = [programId, body, search];

    return Observable.of({});
  }
}

describe('OrientationProgramEditComponent', () => {
  let spy;
  let search;
  let component: OrientationProgramEditComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramEditComponent>;

  const editProgram = {
    'id': 84,
    'name': 'This is new edited name',
    'description': 'this is new edited description',
    'events': 20,
    'members': 30,
    'start': '1557637200',
    'end': '1557637200',
    'has_membership': 1
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrientationDetailsModule],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: OrientationService, useClass: MockOrientationService },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationProgramEditComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);

      search = new URLSearchParams();
      component.session.g.set('school', mockSchool);
      search.append('school_id', component.session.g.get('school').id.toString());
      component.orientationProgram = {
        id: 84,
        name: 'This is new edited name',
        description: 'this is new edited description',
        events: 20,
        members: 30,
        start: 1557637200,
        end: 1557637200,
        has_membership: 1
      };
      component.ngOnInit();
    });
  }));

  it('form validation - should fail', () => {
    component.form.controls['name'].setValue(null);
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - max length 225 - should fail', () => {
    component.form.controls['name'].setValue('This is the text which we are testing the length of 225 thats why we are entering this text greater than 225 to verify the unit test.  The total length of this string is 226 just to make sure its greater than 225 thanks you ..');
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    component.form.controls['name'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should update orientation program', () => {
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'editProgram').and.returnValue(Observable.of(editProgram));

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(component.orientationProgram.id, component.form.value, search);
    expect(spy.calls.count()).toBe(1);
  });

});
