/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { CasesService } from '../cases/cases.service';

import { HealthDashboardComponent } from './health-dashboard.component';

describe('HealthDashboardComponent', () => {
  let component: HealthDashboardComponent;
  let fixture: ComponentFixture<HealthDashboardComponent>;

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDashboardComponent ],
      imports: [CPTestModule],
      providers: [
        CasesService,
        provideMockStore({
          initialState: {
            healthDashBoard: {
              caseStatusesByRank: {},
              error: null,
              loading: false
            }
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
