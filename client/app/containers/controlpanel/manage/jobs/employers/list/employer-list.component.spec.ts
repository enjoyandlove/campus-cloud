import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPSession } from '../../../../../../session';
import { EmployerListComponent } from './employer-list.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../../reducers';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

class MockEmployerService {
  dummy;
  mockEmployers = require('../mockEmployer.json');

  getEmployers(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockEmployers);
  }
}

describe('EmployersListComponent', () => {
  let spy;
  let search;
  let service: EmployerService;
  let component: EmployerListComponent;
  let fixture: ComponentFixture<EmployerListComponent>;

  const mockEmployers = require('../mockEmployer.json');
  const employer = {
    id: 1,
    name: 'Hello World!',
    description: 'Test description',
    logo_url: '',
    email: 'test@test.com'
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EmployerModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          { provide: EmployerService, useClass: MockEmployerService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EmployerListComponent);
          component = fixture.componentInstance;
          service = TestBed.get(EmployerService);
          component.session.g.set('school', mockSchool);

          search = new URLSearchParams();
          search.append('search_str', component.state.search_str);
          search.append('sort_field', component.state.sort_field);
          search.append('sort_direction', component.state.sort_direction);
          search.append('school_id', component.session.g.get('school').id.toString());
        });
    })
  );

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('onCreated', () => {
    component.onCreated(employer);

    expect(component.launchCreateModal).toBeFalsy();
    expect(component.state.employers).toEqual([employer]);
  });

  it('onEdited', () => {
    component.onEdited(employer);

    expect(component.launchEditModal).toBeFalsy();
    expect(component.selectedEmployer).toBeNull();
    expect(component.state.employers).toEqual([employer]);
  });

  it('onDeleted', () => {
    component.onDeleted(1);
    expect(component.deleteEmployer).toBeNull();
    expect(component.state.employers).toEqual([]);
  });

  it('should launch create modal', () => {
    expect(component.launchCreateModal).toBeFalsy();
    component.onLaunchCreateModal();
    expect(component.launchCreateModal).toBeTruthy();
  });

  it('should fetch list of employers', fakeAsync(() => {
      spy = spyOn(component.service, 'getEmployers').and.returnValue(Observable.of(mockEmployers));
      component.ngOnInit();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(component.state.employers.length).toEqual(mockEmployers.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
