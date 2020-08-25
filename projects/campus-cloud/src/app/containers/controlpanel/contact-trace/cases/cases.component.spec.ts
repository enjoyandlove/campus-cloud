import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesComponent } from './cases.component';

import { CPTestModule, configureTestSuite } from '@campus-cloud/shared/tests';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CasesUtilsService } from './cases.utils.service';
import { CasesModule } from './cases.module';
import { EffectsModule } from '@ngrx/effects';

describe('CasesComponent', () => {
  let component: CasesComponent;
  let fixture: ComponentFixture<CasesComponent>;

  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [CasesComponent],
        imports: [CPTestModule, EffectsModule.forRoot([]), CasesModule],
        providers: [CPI18nPipe, CasesUtilsService, CPI18nPipe]
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
