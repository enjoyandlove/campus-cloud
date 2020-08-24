import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsComponent } from './case-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RootStoreModule } from '@projects/campus-cloud/src/app/store';
import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { CasesService } from '../cases.service';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { mockSchool } from '@campus-cloud/session/mock/school';

describe('CaseDetailsComponent', () => {
  let component: CaseDetailsComponent;
  let fixture: ComponentFixture<CaseDetailsComponent>;
  let session: CPSession;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseDetailsComponent],
      imports: [RouterTestingModule, RootStoreModule, CPTestModule],
      providers: [CasesService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailsComponent);
    component = fixture.componentInstance;
    component.userId = 0;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
