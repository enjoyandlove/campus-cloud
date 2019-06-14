import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { RootStoreModule } from '@app/store';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockMember } from '@libs/members/common/tests';
import { CPDeleteModalComponent } from '@shared/components';
import { MODAL_DATA, CPI18nService } from '@shared/services';
import { MemerUpdateType } from '@libs/members/common/model';
import { OrientationMembersDeleteComponent } from './delete.component';
import { LibsCommmonMembersModule } from '@libs/members/common/common-members.module';
import { LibsCommonMembersUtilsService } from '@libs/members/common/providers/common.utils';

describe('OrientationMembersDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          SharedModule,
          RootStoreModule,
          HttpClientModule,
          RouterTestingModule,
          LibsCommmonMembersModule,
          StoreModule.forFeature('orientationMemberState', fromStore.reducers)
        ],
        providers: [
          CPSession,
          CPI18nService,
          LibsCommonMembersUtilsService,
          {
            provide: MODAL_DATA,
            useValue: {
              data: { member: mockMember, groupId: 1 },
              onClose: () => {}
            }
          }
        ],
        declarations: [OrientationMembersDeleteComponent]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let deleteModal: CPDeleteModalComponent;
  let component: OrientationMembersDeleteComponent;
  let store: Store<fromStore.IOrientationMembersState>;
  let fixture: ComponentFixture<OrientationMembersDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationMembersDeleteComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    store = TestBed.get(Store);
    deleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;
    fixture.detectChanges();
  }));

  it('should call onDelete on cp-delete-modal deleteClick', () => {
    spyOn(component, 'onDelete');
    deleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should call resetModal on cp-delete-modal cancelClick', () => {
    spyOn(component, 'resetModal');
    deleteModal.cancelClick.emit();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should dispatch DeleteMember onDelete', () => {
    spyOn(store, 'dispatch');

    component.onDelete();

    const payload = {
      body: {
        group_id: component.groupId,
        member_type: MemerUpdateType.remove
      },
      memberId: component.member.id
    };

    const expected = new fromStore.DeleteMember(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expected);
  });
});
