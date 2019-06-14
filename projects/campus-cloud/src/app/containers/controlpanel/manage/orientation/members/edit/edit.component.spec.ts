import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { RootStoreModule } from '@campus-cloud/store';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { OrientationMembersEditComponent } from './edit.component';
import { mockMember, filledForm } from '@campus-cloud/libs/members/common/tests';
import { MODAL_DATA, CPI18nService, IModal } from '@campus-cloud/shared/services';
import { MemberType, MemberModel } from '@campus-cloud/libs/members/common/model';
import { getElementByCPTargetValue, fillForm } from '@campus-cloud/shared/utils/tests';
import { LibsCommmonMembersModule } from '@campus-cloud/libs/members/common/common-members.module';
import { LibsCommonMembersUtilsService } from '@campus-cloud/libs/members/common/providers/common.utils';

describe('OrientationMembersEditComponent', () => {
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
        declarations: [OrientationMembersEditComponent]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let modal: IModal;
  let de: DebugElement;
  let component: OrientationMembersEditComponent;
  let store: Store<fromStore.IOrientationMembersState>;
  let fixture: ComponentFixture<OrientationMembersEditComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationMembersEditComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    store = TestBed.get(Store);
    modal = TestBed.get(MODAL_DATA);
    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should call close modal onClose', () => {
    spyOn(modal, 'onClose');

    component.onClose();

    expect(modal.onClose).toHaveBeenCalled();
  });

  it('should call onClose on cancel button click', () => {
    spyOn(component, 'onClose');

    const cancelButton: HTMLButtonElement = getElementByCPTargetValue(de, 'cancel').nativeElement;

    cancelButton.click();

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call onClose on close button click', () => {
    spyOn(component, 'onClose');

    const closeButton: HTMLSpanElement = getElementByCPTargetValue(de, 'close').nativeElement;

    closeButton.click();

    expect(component.onClose).toHaveBeenCalled();
  });

  it('submit button should be disabled if form is invalid', () => {
    let submitBtn: HTMLButtonElement;

    submitBtn = getElementByCPTargetValue(de, 'submit').nativeElement;

    expect(submitBtn.disabled).toBe(false);
    component.form = MemberModel.form();
    fixture.detectChanges();

    submitBtn = getElementByCPTargetValue(de, 'submit').nativeElement;

    expect(submitBtn.disabled).toBe(true);
  });

  it('should dispatch EditMember onSave', () => {
    spyOn(store, 'dispatch');
    fillForm(component.form, filledForm);

    component.onSave();

    const payload = {
      member: component.form.value,
      memberId: modal.data.member.id
    };

    const expected = new fromStore.EditMember(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expected);
  });

  it('should clear member_position onSave if member type is not executive', () => {
    const mockPosition = 'value';
    const nonExecutiveMember = {
      ...filledForm,
      member_position: mockPosition,
      member_type: MemberType.member
    };

    spyOn(store, 'dispatch');
    fillForm(component.form, nonExecutiveMember);

    expect(component.form.value['member_position']).toBe(mockPosition);

    component.onSave();

    expect(component.form.value['member_position']).toBe('');
  });
});
