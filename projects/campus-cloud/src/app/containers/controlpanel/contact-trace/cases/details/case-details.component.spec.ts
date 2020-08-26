import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsComponent } from './case-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { CasesService } from '../cases.service';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { provideMockStore } from '@ngrx/store/testing';

describe('CaseDetailsComponent', () => {
  let component: CaseDetailsComponent;
  let fixture: ComponentFixture<CaseDetailsComponent>;
  let session: CPSession;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseDetailsComponent],
      imports: [RouterTestingModule, CPTestModule],
      providers: [CasesService, provideMockStore({
        initialState: {
          caseModule: {
            cases: {},
            caseStatus: {}
          }
        }
      })]
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
