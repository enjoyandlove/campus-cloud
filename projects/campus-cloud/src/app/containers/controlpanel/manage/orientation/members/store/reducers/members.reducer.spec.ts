import * as fromActions from '../actions';
import { initialState, reducer } from './members.reducer';
import { mockMember } from '@libs/members/common/tests/mock';
import { IMember, MemerUpdateType } from '@campus-cloud/src/app/libs/members/common/model';

describe('Orientation Members Reducer', () => {
  describe('GET_MEMBERS', () => {
    it('it should set loading flag to true', () => {
      const payload = { groupId: 1 };

      const action = new fromActions.GetMembers(payload);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(true);
    });
  });

  describe('GET_MEMBERS_FAIL', () => {
    it('it should set loading flag to false', () => {
      const action = new fromActions.GetMembersFail();
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(false);
    });
  });

  describe('GET_MEMBERS_SUCCESS', () => {
    const action = new fromActions.GetMembersSuccess({
      next: true,
      previous: false,
      data: [mockMember]
    });

    it('should set loading flag to false', () => {
      const { loading } = reducer(initialState, action);
      expect(loading).toBe(false);
    });

    it('should set next flag to true', () => {
      const { next } = reducer(initialState, action);
      expect(next).toBe(true);
    });

    it('should add entities and ids for retrieved members', () => {
      const { ids, entities } = reducer(initialState, action);
      expect(ids.length).toBe(1);
      expect(entities[mockMember.id]).toBeDefined();
    });
  });

  describe('CREATE_MEMBER', () => {
    it('it should set loading flag to true', () => {
      const payload = {
        member: mockMember,
        memberId: mockMember.id
      };

      const action = new fromActions.CreateMember(payload);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(true);
    });
  });

  describe('CREATE_MEMBER_FAIL', () => {
    it('it should set loading flag to false', () => {
      const action = new fromActions.CreateMemberFail();
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(false);
    });
  });

  describe('CREATE_MEMBER_SUCCESS', () => {
    it('it should set loading flag to false', () => {
      const action = new fromActions.CreateMemberSuccess(mockMember);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(false);
    });

    it('should update state with newly created member', () => {
      const action = new fromActions.CreateMemberSuccess(mockMember);
      const { ids, entities } = reducer(initialState, action);

      expect(ids.length).toBe(1);
      expect(entities[mockMember.id]).toBeDefined();
    });
  });

  describe('CREATE_MEMBER', () => {
    it('it should set loading flag to true', () => {
      const payload = {
        member: mockMember,
        memberId: mockMember.id
      };

      const action = new fromActions.CreateMember(payload);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(true);
    });
  });

  describe('EDIT_MEMBER', () => {
    it('it should set loading flag to true', () => {
      const payload = { member: mockMember, memberId: mockMember.id };

      const action = new fromActions.EditMember(payload);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(true);
    });
  });

  describe('EDIT_MEMBER_FAIL', () => {
    it('it should set loading flag to false', () => {
      const action = new fromActions.EditMemberFail();
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(false);
    });
  });

  describe('EDIT_MEMBER_SUCCESS', () => {
    let updatedMember: IMember;
    const editedPosition = 'value';
    let action: fromActions.EditMemberSuccess;

    beforeEach(() => {
      const newMember = new fromActions.CreateMemberSuccess(mockMember);
      reducer(initialState, newMember);

      updatedMember = {
        ...mockMember,
        member_position: editedPosition
      };

      action = new fromActions.EditMemberSuccess(updatedMember);
    });

    it('should set loading flag to false', () => {
      const { loading } = reducer(initialState, action);
      expect(loading).toBe(false);
    });

    it('should update state with updated member', () => {
      const { ids, entities } = reducer(initialState, action);

      expect(ids.length).toBe(1);
      expect(entities[mockMember.id]).toEqual(updatedMember);
      expect(entities[mockMember.id].member_position).toBe(editedPosition);
    });
  });

  describe('DELETE_MEMBER', () => {
    it('it should set loading flag to true', () => {
      const payload = {
        body: { group_id: 1, member_type: MemerUpdateType.remove },
        memberId: mockMember.id
      };

      const action = new fromActions.DeleteMember(payload);
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(true);
    });
  });

  describe('DELETE_MEMBER_FAIL', () => {
    it('should set loading flag to false', () => {
      const action = new fromActions.DeleteMemberFail();
      const { loading } = reducer(initialState, action);

      expect(loading).toBe(false);
    });
  });

  describe('DELETE_MEMBER_SUCCESS', () => {
    it('should remove deleted member from the store', () => {
      const stateWithMember = {
        ...initialState,
        ids: [...initialState.ids, mockMember.id],
        entities: {
          [mockMember.id]: mockMember
        }
      };
      const action = new fromActions.DeleteMemberSuccess(mockMember);
      const { ids } = reducer(stateWithMember, action);

      expect(ids.length).toBe(0);
    });
  });
});
