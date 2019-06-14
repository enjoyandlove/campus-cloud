import { EntityState, createEntityAdapter, EntityAdapter, Dictionary } from '@ngrx/entity';

import * as fromMembers from '../actions/members.actions';
import { IMember } from '@campus-cloud/app/libs/members/common/model';

export interface OrientationMemberState extends EntityState<IMember> {
  next: boolean;
  loading: boolean;
  previous: boolean;
  ids: Array<number>;
  entities: Dictionary<IMember>;
}

export const initialState: OrientationMemberState = {
  ids: [],
  loading: false,
  entities: {},
  next: false,
  previous: false
};

export const membersAdapter: EntityAdapter<IMember> = createEntityAdapter<IMember>();

export function reducer(
  state = initialState,
  action: fromMembers.MembersActions
): OrientationMemberState {
  switch (action.type) {
    case fromMembers.MembersType.EDIT_MEMBER:
    case fromMembers.MembersType.GET_MEMBERS:
    case fromMembers.MembersType.DELETE_MEMBER:
    case fromMembers.MembersType.CREATE_MEMBER: {
      return {
        ...state,
        loading: true
      };
    }

    case fromMembers.MembersType.EDIT_MEMBER_FAIL:
    case fromMembers.MembersType.GET_MEMBERS_FAIL:
    case fromMembers.MembersType.DELETE_MEMBER_FAIL:
    case fromMembers.MembersType.CREATE_MEMBER_FAIL: {
      return {
        ...state,
        loading: false
      };
    }
    case fromMembers.MembersType.EDIT_MEMBER_SUCCESS:
    case fromMembers.MembersType.CREATE_MEMBER_SUCCESS: {
      const member = action.payload;

      return membersAdapter.upsertOne(member, {
        ...state,
        loading: false
      });
    }

    case fromMembers.MembersType.DELETE_MEMBER_SUCCESS: {
      const member = action.payload;

      return membersAdapter.removeOne(member.id, {
        ...state,
        loading: false
      });
    }

    case fromMembers.MembersType.GET_MEMBERS_SUCCESS: {
      const { data, next, previous } = action.payload;

      return membersAdapter.addAll(data, {
        ...state,
        next,
        previous,
        loading: false
      });
    }

    default:
      return state;
  }
}

const { selectAll } = membersAdapter.getSelectors();

export const getMembers = selectAll;
export const getLoading = (state: OrientationMemberState) => state.loading;
export const getNext = (state: OrientationMemberState) => state.next;
export const getPrevious = (state: OrientationMemberState) => state.previous;
