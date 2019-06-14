import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { RootStoreModule } from '@app/store';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { MemberType } from '@libs/members/common/model';
import { mockMember, filledForm } from '@libs/members/common/tests';
import { MODAL_DATA, CPI18nService, IModal } from '@shared/services';
import { OrientationMembersCreateComponent } from './create.component';
import { getElementByCPTargetValue, fillForm } from '@shared/utils/tests';
import { LibsCommmonMembersModule } from '@libs/members/common/common-members.module';
import { LibsCommonMembersUtilsService } from '@libs/members/common/providers/common.utils';

describe('OrientationMembersCreateComponent', () => {
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
              data: mockMember.id,
              onClose: () => {}
            }
          }
        ],
        declarations: [OrientationMembersCreateComponent]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let modal: IModal;
  let de: DebugElement;
  let component: OrientationMembersCreateComponent;
  let store: Store<fromStore.IOrientationMembersState>;
  let fixture: ComponentFixture<OrientationMembersCreateComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationMembersCreateComponent);
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

    expect(submitBtn.disabled).toBe(true);
    fillForm(component.form, filledForm);

    fixture.detectChanges();

    submitBtn = getElementByCPTargetValue(de, 'submit').nativeElement;

    expect(submitBtn.disabled).toBe(false);
  });

  it('should dispatch CreateMember onSave', () => {
    spyOn(store, 'dispatch');
    fillForm(component.form, filledForm);

    component.onSave();

    const payload = {
      member: component.form.value,
      memberId: component.form.value.member
    };

    const expected = new fromStore.CreateMember(payload);

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
