import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import * as fromStore from '../store';
import { MockActivatedRoute } from '../tests';
import { CPSession } from '@campus-cloud/session';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CustomSerializer } from '@campus-cloud/store/serializers';
import { OrientationMembersListComponent } from './list.component';
import { mockMember } from '@campus-cloud/libs/members/common/tests';
import { RouterParamsUtils } from '@campus-cloud/shared/utils/router';
import { RootStoreModule } from '@campus-cloud/store/root-store.module';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { LibsCommonMembersUtilsService } from '@campus-cloud/libs/members/common/providers';
import { CPTrackingService, CPI18nService, ModalService } from '@campus-cloud/shared/services';
import { LibsCommmonMembersModule } from '@campus-cloud/libs/members/common/common-members.module';
import {
  CPSpinnerComponent,
  CPNoContentComponent,
  CPPaginationComponent
} from '@campus-cloud/shared/components';
import {
  LibsMembersListComponent,
  MembersActionBoxComponent
} from '@campus-cloud/libs/members/common/components';

describe('OrientationMembersListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [OrientationMembersListComponent],
        imports: [
          CPTestModule,
          SharedModule,
          RootStoreModule,
          HttpClientModule,
          RouterTestingModule,
          LibsCommmonMembersModule,
          StoreRouterConnectingModule,
          StoreModule.forFeature('orientationMemberState', fromStore.reducers)
        ],
        providers: [
          CPSession,
          ModalService,
          CPI18nService,
          RouterParamsUtils,
          CPTrackingService,
          LibsCommonMembersUtilsService,
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: RouterStateSerializer, useClass: CustomSerializer }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let modalService: ModalService;
  let utils: LibsCommonMembersUtilsService;
  let component: OrientationMembersListComponent;
  let store: MockStore<fromStore.IOrientationMembersState>;
  let fixture: ComponentFixture<OrientationMembersListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationMembersListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    store = TestBed.get(Store);
    modalService = TestBed.get(ModalService);
    utils = TestBed.get(LibsCommonMembersUtilsService);

    spyOn(store, 'dispatch').and.callThrough();

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial filters state', () => {
    const expected = {
      sort_field: 'member_type',
      search_str: undefined,
      sort_direction: 'desc'
    };
    component.filters$.subscribe((state) => {
      expect(state).toEqual(expected);
    });
  });

  it('should set initial pagination', () => {
    const expected = { next: false, previous: false, page: 1 };
    component.pagination$.subscribe((state) => {
      expect(state).toEqual(expected);
    });
  });

  describe('cp-members-list', () => {
    it('should not show when no members are found', () => {
      noMembers(component);
      fixture.detectChanges();

      const membersList = de.query(By.directive(LibsMembersListComponent));

      expect(membersList).toBeNull();
    });

    describe('cp-members-list shown', () => {
      let membersList: LibsMembersListComponent;

      beforeEach(() => {
        withMockMember(component);
        fixture.detectChanges();
        membersList = de.query(By.directive(LibsMembersListComponent)).componentInstance;
      });

      it('should show when members are found', () => {
        expect(membersList).not.toBeNull();
      });

      it('should call doSort', () => {
        spyOn(component, 'doSort').and.callThrough();
        spyOn(component, 'fetch');

        fixture.ngZone.run(() => {
          membersList.sort.emit('some');
        });
        expect(component.doSort).toHaveBeenCalled();
        expect(component.fetch).toHaveBeenCalled();
      });

      it('should call onDeleteClick on component deleteClick', () => {
        const expecteGroupId = 1;
        component.groupId = expecteGroupId;
        fixture.detectChanges();

        spyOn(component, 'closeActiveModal');
        const spy: jasmine.Spy = spyOn(modalService, 'open');

        membersList.deleteClick.emit(mockMember);
        const {
          data: { member, groupId },
          onClose
        } = spy.calls.mostRecent().args[2];

        expect(member).toEqual(mockMember);
        expect(groupId).toEqual(expecteGroupId);

        onClose();
        expect(component.closeActiveModal).toHaveBeenCalled();
      });

      it('should call onEditClick on component editClick', () => {
        const expecteGroupId = 1;
        component.groupId = expecteGroupId;
        fixture.detectChanges();

        spyOn(component, 'closeActiveModal');
        const spy: jasmine.Spy = spyOn(modalService, 'open');

        membersList.editClick.emit(mockMember);
        const {
          data: { member, groupId },
          onClose
        } = spy.calls.mostRecent().args[2];

        expect(member).toEqual(mockMember);
        expect(groupId).toEqual(expecteGroupId);

        onClose();
        expect(component.closeActiveModal).toHaveBeenCalled();
      });

      it('should call onDeleteClick on component deleteClick', () => {
        const expecteGroupId = 1;
        component.groupId = expecteGroupId;
        fixture.detectChanges();

        spyOn(component, 'closeActiveModal');
        const spy: jasmine.Spy = spyOn(modalService, 'open');

        membersList.deleteClick.emit(mockMember);
        const {
          data: { member, groupId },
          onClose
        } = spy.calls.mostRecent().args[2];

        expect(member).toEqual(mockMember);
        expect(groupId).toEqual(expecteGroupId);

        onClose();
        expect(component.closeActiveModal).toHaveBeenCalled();
      });
    });
  });

  describe('cp-no-content', () => {
    it('should show when no members are found', () => {
      noMembers(component);
      fixture.detectChanges();

      const noContent = de.query(By.directive(CPNoContentComponent));

      expect(noContent).not.toBeNull();
    });

    it('should not show when members are found', () => {
      withMockMember(component);
      fixture.detectChanges();

      const noContent = de.query(By.directive(CPNoContentComponent));

      expect(noContent).toBeNull();
    });
  });

  describe('cp-spinner', () => {
    it('should show on loading$ true', () => {
      component.loading$ = of(true);

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).not.toBeNull();
    });

    it('should show on loading$ false', () => {
      component.loading$ = of(false);

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).toBeNull();
    });
  });

  describe('cp-pagination', () => {
    it('should not show when no members are found', () => {
      noMembers(component);
      fixture.detectChanges();

      const paginationComp = de.query(By.directive(CPPaginationComponent));
      expect(paginationComp).toBeNull();
    });

    it('should show when no members are found', () => {
      withMockMember(component);
      fixture.detectChanges();

      const paginationComp = de.query(By.directive(CPPaginationComponent));
      expect(paginationComp).not.toBeNull();
    });
  });

  describe('cp-members-action-box', () => {
    let actionBoxComp: MembersActionBoxComponent;

    beforeEach(() => {
      actionBoxComp = de.query(By.directive(MembersActionBoxComponent)).componentInstance;
    });

    it('should call onSearch', () => {
      const query = 'query';

      spyOn(component, 'onSearch');
      actionBoxComp.search.emit(query);

      expect(component.onSearch).toHaveBeenCalledWith(query);
    });

    it('should call onLaunchCreateModal on component create', () => {
      const expecteGroupId = 1;
      component.groupId = expecteGroupId;
      fixture.detectChanges();

      const spy: jasmine.Spy = spyOn(modalService, 'open');

      actionBoxComp.create.emit();
      const { data } = spy.calls.mostRecent().args[2];

      expect(data).toEqual(expecteGroupId);
    });

    it('should call onDownloadCsvFile on component download', () => {
      component.members$ = of([mockMember]);
      fixture.detectChanges();
      const trackDownloadedMembersSpy = spyOn(component, 'trackDownloadedMembers');
      const utilsSpy = spyOn(utils, 'createExcel');

      actionBoxComp.download.emit();

      expect(trackDownloadedMembersSpy).toHaveBeenCalled();
      expect(utilsSpy).toHaveBeenCalledWith([mockMember]);
    });
  });
});

function noMembers(component: OrientationMembersListComponent) {
  component.members$ = of([]);
  component.loading$ = of(false);
}

function withMockMember(component: OrientationMembersListComponent) {
  component.members$ = of([mockMember]);
  component.loading$ = of(false);
}
