import { Store } from '@ngrx/store';
import { CaseViewComponent } from './case-view.component';
import { HttpClientModule } from '@angular/common/http';
import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { CasesUtilsService } from '../../../cases.utils.service';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import * as fromStore from '../../../store';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let fixture: ComponentFixture<CaseViewComponent>;
  let store: MockStore<fromStore.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, HttpClientModule, RouterTestingModule],
      providers: [
        CasesUtilsService,
        provideMockStore({
          initialState: {
            casesModule: {
              cases: {},
              caseStatus: {}
            }
          }
        }),
        CPI18nPipe
      ],
      declarations: [CaseViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    component.case = {
      current_action: { name: '', id: 0, case_status_id: 0, rank: 0, code: '' },
      current_status: {
        name: 'Symptomatic',
        color: 'FF7A00',
        id: 2,
        case_count: 0,
        rank: 0,
        user_list_id: 1111
      },
      current_status_id: 2,
      date_last_modified: 1597879214,
      extern_user_id: 'testtest1@test.com',
      firstname: 'test1',
      id: 12,
      lastname: 'test1',
      notes: 'test notes for a test case kangaroo',
      user_id: 0
    };
    component.case = {
      ...component.case,
      id: 123
    };

    fixture.detectChanges();
  });

  it('should create', inject([Store], (store) => {
    expect(store).toBeTruthy();
  }));

  afterAll(() => store.resetSelectors());
});
