import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseTotalCountViewComponent } from './case-total-count-view.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../../store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { RouterTestingModule } from '@angular/router/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';

describe('CaseTotalCountViewComponent', () => {
  let component: CaseTotalCountViewComponent;
  let fixture: ComponentFixture<CaseTotalCountViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('casesModule', reducers),
        CPTestModule
      ],
      declarations: [CaseTotalCountViewComponent],
      providers: [CPI18nService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseTotalCountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
