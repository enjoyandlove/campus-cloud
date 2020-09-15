/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { CasesService } from '../../../cases/cases.service';
import { StatusCardsComponent } from './status-cards.component';
import * as fromStore from '../../store';

describe('StatusCardsComponent', () => {
  let component: StatusCardsComponent;
  let fixture: ComponentFixture<StatusCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusCardsComponent],
      imports: [CPTestModule],
      providers: [
        CasesService,
        CPSession,
        provideMockStore({
          selectors: [
            {
              selector: fromStore.selectCaseStatusesByRank,
              value: { 5: { case_count: 10 } }
            }
          ]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct clear case count', () => {
    const clearCount = fixture.debugElement.queryAll(By.css('.case-count'))[0].nativeElement
      .textContent;
    expect(Number(clearCount)).toBe(10);
  });
});
