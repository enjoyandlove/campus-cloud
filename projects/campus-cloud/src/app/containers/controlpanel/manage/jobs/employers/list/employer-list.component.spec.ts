import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of as observableOf } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { IEmployer } from './../employer.interface';
import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EmployerListComponent } from './employer-list.component';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';
import { mockEmployer, MockEmployerService } from '@controlpanel/manage/jobs/employers/tests/mock';

describe('EmployersListComponent', () => {
  let spy;
  let session: CPSession;
  let component: EmployerListComponent;
  let fixture: ComponentFixture<EmployerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, EmployerModule, RouterTestingModule],
      providers: [
        CPTrackingService,
        provideMockStore(),
        { provide: EmployerService, useClass: MockEmployerService },
        {
          provide: READY_MODAL_DATA,
          useValue: {
            dispose: () => {},
            onClose: () => {},
            onAction: () => {},
            data: mockEmployer
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployerListComponent);
        component = fixture.componentInstance;

        session = TestBed.get(CPSession);
        session.g.set('school', mockSchool);

        component.state.employers = [mockEmployer];
      });
  }));

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('onCreated', () => {
    expect(component.state.employers.length).toBe(1);

    component.onCreated(mockEmployer);

    expect(component.state.employers.length).toBe(2);
    expect(component.state.employers[0]).toEqual(mockEmployer);
  });

  it('onEdited', () => {
    const original: IEmployer = { ...component.state.employers[0] };

    const edited = {
      ...original,
      email: 'edited'
    };

    component.onEdited(edited);

    const actual = component.state.employers.filter((e) => e.id === original.id)[0];

    expect(actual).toEqual(edited);
  });

  it('onDeleted', () => {
    spyOn(component, 'resetModal');
    const expected = component.state.employers.filter((e) => e.id === mockEmployer.id);

    component.onDeleted(1);
    expect(component.resetModal).toHaveBeenCalled();
    expect(component.state.employers.length).toBe(1);
    expect(component.state.employers).toEqual(expected);
  });

  it('should fetch list of employers', () => {
    spy = spyOn(component.service, 'getEmployers').and.returnValue(observableOf([mockEmployer]));

    component.fetch();

    expect(spy).toHaveBeenCalled();
    expect(component.state.employers.length).toEqual(1);
    expect(component.state.employers).toEqual([mockEmployer]);
  });
});
