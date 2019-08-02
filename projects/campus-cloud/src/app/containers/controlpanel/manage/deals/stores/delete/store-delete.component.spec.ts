import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule as NgrxStore } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreModule } from '../store.module';
import * as fromDeals from '@campus-cloud/store/manage/deals';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { StoreDeleteComponent } from './store-delete.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('DealsStoreDeleteComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, StoreModule, RouterTestingModule, NgrxStore.forRoot({})],
        providers: [Store, Actions]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: StoreDeleteComponent;
  let fixture: ComponentFixture<StoreDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreDeleteComponent);
    component = fixture.componentInstance;

    component.store = {
      id: 1,
      name: 'Hello World',
      logo_url: 'image.jpeg',
      description: 'This is description'
    };
    component.session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should dispatch delete action', () => {
    spy = spyOn(component.stateStore, 'dispatch');
    component.onDelete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromDeals.DeleteStore(component.store.id));
  });

  it('should emit after delete', async(() => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');

    component.stateStore.dispatch(new fromDeals.DeleteStoreSuccess(component.store.id));
    fixture.detectChanges();

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.store.id);
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  }));
});
