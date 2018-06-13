import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { EmployerDeleteComponent } from './employer-delete.component';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

class MockEmployerService {
  dummy;
  deleteEmployer(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('EmployerDeleteComponent', () => {
  let spy;
  let search;
  let component: EmployerDeleteComponent;
  let service: EmployerService;
  let fixture: ComponentFixture<EmployerDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EmployerModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        { provide: EmployerService, useClass: MockEmployerService },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EmployerDeleteComponent);
      component = fixture.componentInstance;
      service = TestBed.get(EmployerService);

      search = new URLSearchParams();
      component.employer = {
        id: 84,
        name: 'Hello World',
        description: 'This is description'
      };

      component.session.g.set('school', mockSchool);
      search.append('school_id', component.session.g.get('school').id.toString());
    });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete employer', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');
    spy = spyOn(component.service, 'deleteEmployer').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.employer.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.employer.id);

    expect(component.resetDeleteModal.emit).toHaveBeenCalled();
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  });

});
