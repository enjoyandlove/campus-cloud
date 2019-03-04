import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { reducerMap } from '../store';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import * as actions from '../store/testers.actions';
import { SharedModule } from '@shared/shared.module';
import { TestersListComponent } from './testers-list.component';
import { SETTINGS_TESTERS, SortDirection } from '@shared/constants';
import { TestUsersComponent } from './components/test-users/test-users.component';
import { TestersActionBoxComponent } from './components/testers-action-box/testers-action-box.component';

describe('TestersListComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [
          SharedModule,
          StoreModule.forRoot({}),
          StoreModule.forFeature(SETTINGS_TESTERS, reducerMap)
        ],
        providers: [CPI18nService],
        declarations: [TestersListComponent, TestersActionBoxComponent, TestUsersComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestersListComponent;
  let fixture: ComponentFixture<TestersListComponent>;
  let spyFetch;
  let spyDispatch;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(TestersListComponent);
      component = fixture.componentInstance;

      spyFetch = spyOn(component, 'fetch').and.callThrough();
      spyDispatch = spyOn(component.store, 'dispatch');

      fixture.detectChanges();
    })
  );

  it('should create and fetch w/ dispatch', () => {
    expect(component).toBeTruthy();
    expect(spyFetch).toHaveBeenCalled();
    expect(spyDispatch).toHaveBeenCalledWith(new actions.LoadTesters());
  });

  it('should search and fetch', () => {
    spyFetch.calls.reset();
    const search = 'test';
    component.doSearch(search);
    expect(spyDispatch).toHaveBeenCalledWith(new actions.SetTestersSearch(search));
    expect(spyFetch).toHaveBeenCalled();
  });

  it('should toggle sort and fetch', () => {
    spyFetch.calls.reset();
    component.doSort(SortDirection.ASC);
    expect(spyDispatch).toHaveBeenCalledWith(new actions.SetTestersSort(SortDirection.DESC));
    expect(spyFetch).toHaveBeenCalled();
  });
});
