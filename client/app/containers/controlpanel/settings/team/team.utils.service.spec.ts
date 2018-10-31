import { TeamUtilsService } from './team.utils.service';
import { CPI18nService } from '../../../../shared/services';
import { CP_PRIVILEGES_MAP } from './../../../../shared/constants/privileges';

const privilegeSet = { r: true, w: true };

describe('TeamUtilsService', () => {
  let service: TeamUtilsService;

  beforeEach(() => {
    service = new TeamUtilsService(new CPI18nService());
  });

  it('should check if Studio privilege exists in object', () => {
    let obj = {};

    expect(service.hasStudio(obj)).toBe(false);

    obj = {
      [CP_PRIVILEGES_MAP.assessment]: privilegeSet
    };

    expect(service.hasStudio(obj)).toBe(false);

    obj = {
      [CP_PRIVILEGES_MAP.app_customization]: privilegeSet
    };

    expect(service.hasStudio(obj)).toBe(true);
  });

  it('should check if school object has required privileges for studio', () => {
    let obj = {};

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.athletics]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.clubs]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.events]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.services]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.calendar]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(false);

    obj = {
      ...obj,
      [CP_PRIVILEGES_MAP.orientation]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(obj)).toBe(true);

    const fullPrivileges = {
      [CP_PRIVILEGES_MAP.athletics]: privilegeSet,
      [CP_PRIVILEGES_MAP.clubs]: privilegeSet,
      [CP_PRIVILEGES_MAP.events]: privilegeSet,
      [CP_PRIVILEGES_MAP.services]: privilegeSet,
      [CP_PRIVILEGES_MAP.calendar]: privilegeSet,
      [CP_PRIVILEGES_MAP.orientation]: privilegeSet
    };

    expect(service.hasFullStudioPrivilege(fullPrivileges)).toBe(true);
  });
});
