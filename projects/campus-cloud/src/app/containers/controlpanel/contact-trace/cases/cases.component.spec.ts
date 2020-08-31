import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';

import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CasesUtilsService } from './cases.utils.service';
import { provideMockStore } from '@ngrx/store/testing';
import { CasesService } from './cases.service';

describe('CasesComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;

  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [CasesComponent],
        imports: [CPTestModule],
        providers: [
          CPI18nPipe,
          CasesUtilsService,
          CasesService,
          provideMockStore({
            initialState: {
              casesModule: {
                cases: {},
                caseStatus: {}
              }
            }
          })
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
