import { IUser } from './user.interface';
/**
 * User (App Student)
 * {@link https://gitlab.com/ready-edu-doc/product-tech-doc/-/wikis/Platform-Services/REST-API-Admin/User}
 */
export class User {
  readonly status = {
    verified: 1,
    unverified: 0
  };

  static isActive(status = -1) {
    return status > -1;
  }

  static isMutedInSchool(user: IUser, schoolId: number) {
    return user.social_restriction_school_ids.includes(schoolId);
  }
}
