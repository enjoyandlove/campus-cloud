import { CPAmplitudeService } from '../amplitude.service';
import { amplitudeEvents } from '../../constants/analytics';
import { CP_PRIVILEGES_MAP } from '../../constants/privileges';

const service = new CPAmplitudeService();

const account_level_privileges = {
  '587': {
    '22': {
      r: true,
      w: true
    },
    '24': {
      r: true,
      w: true
    }
  }
};

const school_level_privileges = {
  '157': {
    '13': {
      r: true,
      w: true
    },
    '15': {
      r: true,
      w: true
    },
    '17': {
      r: true,
      w: true
    },
    '21': {
      r: true,
      w: true
    },
    '24': {
      r: true,
      w: true
    },
    '25': {
      r: true,
      w: true
    },
  }
};

describe('AmplitudeEventTrackingService', () => {
  it('should get user permissions access', () => {
    const notifyPermissions = service.getNotifyPermissions(school_level_privileges[157]);

    expect(notifyPermissions).toEqual(amplitudeEvents.NO_ACCESS);
  });

  it('should get user permissions access', () => {
    const userPermissionsAccess = service.getUserPermissionsAccessType(
      school_level_privileges[157],
      CP_PRIVILEGES_MAP.jobs);

    expect(userPermissionsAccess).toEqual(amplitudeEvents.FULL_ACCESS);
  });

  it('should get user permissions status', () => {
    const userPermissionsStatus = service.getUserPermissionsStatus(
      school_level_privileges[157],
      CP_PRIVILEGES_MAP.manage_admin);

    expect(userPermissionsStatus).toEqual(amplitudeEvents.DISABLED);
  });

  it('should get event permissions', () => {
    const eventPermissions = service.getEventPermissions(school_level_privileges[157]);

    expect(eventPermissions).toEqual(amplitudeEvents.NO_ACCESS);
  });

  it('should get school/account level permission', () => {
    const accountLevelPrivileges = service.getSchoolOrAccountLevelPermissions(
      school_level_privileges[157],
      account_level_privileges,
      CP_PRIVILEGES_MAP.clubs
    );

    expect(accountLevelPrivileges).toEqual(amplitudeEvents.SELECT_ACCESS);

    const schoolLevelPrivileges = service.getSchoolOrAccountLevelPermissions(
      school_level_privileges[157],
      account_level_privileges,
      CP_PRIVILEGES_MAP.services
    );

    expect(schoolLevelPrivileges).toEqual(amplitudeEvents.FULL_ACCESS);
  });

  it('getUserPermissionsEventProperties', () => {

    const permissions = service.getUserPermissionsEventProperties(
      school_level_privileges[157],
      account_level_privileges
    );

    expect(permissions.links_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.event_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.deals_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.assess_permission).toEqual(amplitudeEvents.DISABLED);
    expect(permissions.invite_permission).toEqual(amplitudeEvents.DISABLED);
    expect(permissions.jobs_permission).toEqual(amplitudeEvents.FULL_ACCESS);
    expect(permissions.notify_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.walls_permission).toEqual(amplitudeEvents.FULL_ACCESS);
    expect(permissions.studio_permission).toEqual(amplitudeEvents.FULL_ACCESS);
    expect(permissions.club_permission).toEqual(amplitudeEvents.SELECT_ACCESS);
    expect(permissions.audience_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.athletic_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.calendar_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.service_permission).toEqual(amplitudeEvents.FULL_ACCESS);
    expect(permissions.locations_permission).toEqual(amplitudeEvents.FULL_ACCESS);
    expect(permissions.orientation_permission).toEqual(amplitudeEvents.FULL_ACCESS);

  });
});
