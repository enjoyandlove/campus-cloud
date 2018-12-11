import { CPAmplitudeService } from '../amplitude.service';
import { amplitudeEvents } from '../../constants/analytics';
import { CP_PRIVILEGES_MAP } from '../../constants/privileges';

const service = new CPAmplitudeService(null);

service.school = {
  id: 157
};

const userPermissions =  {
  school_level_privileges: {
    157: {
      [CP_PRIVILEGES_MAP.jobs]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.services]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.orientation]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.campus_maps]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.moderation]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.app_customization]: {
        r: true,
        w: true
      }
    }
  },
  account_level_privileges: {
    '587': {
      [CP_PRIVILEGES_MAP.clubs]: {
        r: true,
        w: true
      },
      [CP_PRIVILEGES_MAP.services]: {
        r: true,
        w: true
      }
    }
  }
};

describe('AmplitudeEventTrackingService', () => {
  it('should get user notify permissions', () => {
    service.user = { school_level_privileges: {} };

    const notifyPermissions = service.getNotifyPermissions();

    expect(notifyPermissions).toEqual(amplitudeEvents.NO_ACCESS);
  });

  it('should get user jobs permissions', () => {
    service.user = { school_level_privileges: { 157: { 25: {r: true, w: true } } } };

    const userPermissionsAccess = service.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.jobs);

    expect(userPermissionsAccess).toEqual(amplitudeEvents.FULL_ACCESS);
  });

  it('should get user permissions status', () => {
    service.user = { school_level_privileges: {} };

    const userPermissionsStatus = service.getUserPermissionsStatus(CP_PRIVILEGES_MAP.manage_admin);

    expect(userPermissionsStatus).toEqual(amplitudeEvents.DISABLED);
  });

  it('should get event permissions', () => {
    service.user = { school_level_privileges: {} };

    const eventPermissions = service.getEventPermissions();

    expect(eventPermissions).toEqual(amplitudeEvents.NO_ACCESS);
  });

  it('should get school/account level permission', () => {
    service.user = {
      school_level_privileges: { 157: { 24: { r: true, w: true } } },
      account_level_privileges: { 587 : { 22: {r: true, w: true } } }
    };

    const accountLevelPrivileges = service.getSchoolOrAccountLevelPermissions(
      CP_PRIVILEGES_MAP.clubs
    );

    expect(accountLevelPrivileges).toEqual(amplitudeEvents.SELECT_ACCESS);

    const schoolLevelPrivileges = service.getSchoolOrAccountLevelPermissions(
      CP_PRIVILEGES_MAP.services
    );

    expect(schoolLevelPrivileges).toEqual(amplitudeEvents.FULL_ACCESS);
  });

  it('should get user permissions', () => {
    service.user = userPermissions;

    const permissions = service.getUserPermissionsEventProperties();

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

  it('should get user permissions with no school & account level privilege', () => {
    service.user = {
      school_level_privileges: {},
      account_level_privileges: {}
    };

    const permissions = service.getUserPermissionsEventProperties();

    expect(permissions.links_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.event_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.deals_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.assess_permission).toEqual(amplitudeEvents.DISABLED);
    expect(permissions.invite_permission).toEqual(amplitudeEvents.DISABLED);
    expect(permissions.jobs_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.notify_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.walls_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.studio_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.club_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.audience_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.athletic_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.calendar_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.locations_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.service_permission).toEqual(amplitudeEvents.NO_ACCESS);
    expect(permissions.orientation_permission).toEqual(amplitudeEvents.NO_ACCESS);
  });
});
