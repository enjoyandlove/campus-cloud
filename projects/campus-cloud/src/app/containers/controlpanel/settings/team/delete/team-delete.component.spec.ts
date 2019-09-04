import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockTeam } from '@controlpanel/settings/team/tests';
import { AdminService } from '@campus-cloud/shared/services';
import { TeamDeleteComponent } from './team-delete.component';

describe('TeamDeleteComponent', () => {
  let spy;
  let search: HttpParams;
  let session: CPSession;
  let component: TeamDeleteComponent;
  let fixture: ComponentFixture<TeamDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      declarations: [TeamDeleteComponent],
      providers: [AdminService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TeamDeleteComponent);
        component = fixture.componentInstance;
        component.admin = mockTeam;

        session = TestBed.get(CPSession);
        session.g.set('school', mockSchool);

        spyOn(component.deleted, 'emit');
        spyOn(component.unauthorized, 'emit');
        search = new HttpParams().append('school_ids', session.g.get('school').id);
      });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should throw unauthorized error', () => {
    const error = new HttpErrorResponse({ error: 'error', status: 403 });
    spy = spyOn(component.adminService, 'deleteAdminById').and.returnValue(throwError(error));

    component.onDelete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.admin.id, search);

    expect(component.buttonData.disabled).toBe(false);
    expect(component.deleted.emit).not.toHaveBeenCalled();
    expect(component.unauthorized.emit).toHaveBeenCalled();
  });

  it('should delete admin', () => {
    spy = spyOn(component.adminService, 'deleteAdminById').and.returnValue(of({}));

    component.onDelete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.admin.id, search);

    expect(component.buttonData.disabled).toBe(false);
    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.admin.id);
  });
});
