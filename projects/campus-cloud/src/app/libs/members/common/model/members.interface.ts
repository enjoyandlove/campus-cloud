export { IUser as IMember } from '@campus-cloud/shared/models/user';

export enum MemerUpdateType {
  'remove' = -1,
  'addModifyToRegular' = 0,
  'addModifyToExecutive' = 2
}

export enum MemberType {
  'executive_leader' = 2,
  'owner' = 1,
  'member' = 0
}
