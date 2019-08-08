import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { IEmployer } from './../employer.interface';
import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EmployerListComponent } from './employer-list.component';
import { CPTrackingService } from '@campus-cloud/shared/services';

class MockEmployerService {
  dummy;
  mockEmployers = require('../mockEmployer.json');

  getEmployers(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf(this.mockEmployers);
  }
}

describe('EmployersListComponent', () => {
  let spy;
  let search;
  let component: EmployerListComponent;
  let fixture: ComponentFixture<EmployerListComponent>;

  const mockEmployers = require('../mockEmployer.json');
  const employer = {
    id: 3,
    name: 'Hello World!',
    description: 'Test description',
    logo_url: '',
    email: 'test@test.com'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, EmployerModule, RouterTestingModule],
      providers: [
        CPTrackingService,
        provideMockStore(),
        { provide: EmployerService, useClass: MockEmployerService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployerListComponent);
        component = fixture.componentInstance;
        component.session.g.set('school', mockSchool);
        component.state = {
          employers: [],
          search_str: null,
          sort_field: 'name',
          sort_direction: 'asc'
        };

        search = new HttpParams()
          .append('search_str', component.state.search_str)
          .append('sort_field', component.state.sort_field)
          .append('sort_direction', component.state.sort_direction)
          .append('school_id', component.session.g.get('school').id.toString());

        fixture.detectChanges();
      });
  }));

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('onCreated', () => {
    expect(component.state.employers.length).toBe(2);

    component.onCreated(employer);

    expect(component.launchCreateModal).toBeFalsy();
    expect(component.state.employers.length).toBe(3);
    expect(component.state.employers[0]).toEqual(employer);
  });

  it('onEdited', () => {
    const original: IEmployer = { ...component.state.employers[0] };

    const edited = {
      ...original,
      email: 'edited'
    };

    component.onEdited(edited);

    const actual = component.state.employers.filter((e) => e.id === original.id)[0];

    expect(component.launchEditModal).toBeFalsy();
    expect(component.selectedEmployer).toBeNull();
    expect(actual).toEqual(edited);
  });

  it('onDeleted', () => {
    const expected = component.state.employers.filter((e) => e.id === 2);

    component.onDeleted(1);
    expect(component.deleteEmployer).toBeNull();
    expect(component.state.employers.length).toBe(1);
    expect(component.state.employers).toEqual(expected);
  });

  it('should launch create modal', () => {
    expect(component.launchCreateModal).toBeFalsy();
    component.onLaunchCreateModal();
    expect(component.launchCreateModal).toBeTruthy();
  });

  it('should fetch list of employers', fakeAsync(() => {
    spy = spyOn(component.service, 'getEmployers').and.returnValue(observableOf(mockEmployers));
    component.ngOnInit();

    tick();
    expect(spy.calls.count()).toBe(1);
    expect(component.state.employers.length).toEqual(mockEmployers.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));
});
