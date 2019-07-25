import { Injectable } from '@angular/core';
import { isEqual, sortBy } from 'lodash';

import { IItem } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { IExternalAppOpenLinkParams } from './external-app-open.interface';

export const enum ThirdPartyIds {
  canvas = 'canvas',
  orgSync = 'orgSync',
  blackboardLearn = 'Blackboard Learn',
  blackboardInstructor = 'Blackboard Instructor',
  blackboardStudent = 'Blackboard Student',
  microsoftOutlook = 'Microsoft Outlook',
  reaveGuardian = 'Rave Guardian',
  powerSchool = 'Power School',
  moodle = 'Moodle',
  liveSafe = 'Live Safe',
  guideEab = 'Guide EAB',
  corq = 'Corq'
}

@Injectable()
export class ResourceExternalAppOpenUtils {
  static thirdPartyShortcuts = {
    [ThirdPartyIds.canvas]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.instructure.candroid&hl=en',
        package_name: 'com.instructure.candroid'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/canvas-by-instructure/id480883488?mt=8',
        app_link: 'canvas-courses://'
      }
    },
    [ThirdPartyIds.orgSync]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.orgsync.orgsync&hl=en',
        package_name: 'com.orgsync.orgsync'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/orgsync/id871531292?mt=8',
        app_link: 'orgsync://'
      }
    },
    [ThirdPartyIds.blackboardLearn]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.blackboard.android.bbstudent',
        package_name: 'com.blackboard.android'
      },
      ios: {
        fallback_http_url:
          'https://itunes.apple.com/us/app/blackboard-mobile-learn/id376413870?mt=8',
        app_link: 'bblearn://'
      }
    },
    [ThirdPartyIds.blackboardInstructor]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.blackboard.android.bbinstructor',
        package_name: 'com.blackboard.android.bbinstructor'
      },
      ios: {
        fallback_http_url:
          'https://itunes.apple.com/us/app/blackboard-instructor/id1088457824?mt=8',
        app_link: 'bbinstructor://'
      }
    },
    [ThirdPartyIds.blackboardStudent]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.blackboard.android.bbstudent',
        package_name: 'com.blackboard.android.bbstudent'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/bb-student/id950424861?mt=8',
        app_link: 'bbstudent://'
      }
    },
    [ThirdPartyIds.microsoftOutlook]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.microsoft.office.outlook',
        package_name: 'com.microsoft.office.outlook&hl=en_US'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/microsoft-outlook/id951937596?mt%3D8',
        app_link: 'ms-outlook://'
      }
    },
    [ThirdPartyIds.reaveGuardian]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.ravemobilesafety.raveguardian',
        package_name: 'com.ravemobilesafety.raveguardian'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/rave-guardian/id691246562?mt=8',
        app_link: 'raveguardian://'
      }
    },
    [ThirdPartyIds.powerSchool]: {
      android: {
        fallback_http_url: 'https://play.google.com/store/apps/details?id=com.powerschool.portal',
        package_name: 'com.powerschool.portal&hl=en'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/powerschool-mobile/id973741088?mt=8',
        app_link: 'psportal://'
      }
    },
    [ThirdPartyIds.moodle]: {
      android: {
        fallback_http_url: 'https://play.google.com/store/apps/details?id=com.moodle.moodlemobile',
        package_name: 'com.moodle.moodlemobile'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/moodle-mobile/id633359593?mt=8',
        app_link: 'moodlemobile://'
      }
    },
    [ThirdPartyIds.liveSafe]: {
      android: {
        fallback_http_url: 'https://play.google.com/store/apps/details?id=com.livesafe.activities',
        package_name: 'com.livesafe.activities'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/livesafe/id653666211?mt=8',
        app_link: 'livesafeapp://'
      }
    },
    [ThirdPartyIds.guideEab]: {
      android: {
        fallback_http_url: 'https://play.google.com/store/apps/details?id=com.eab.se&hl=en',
        package_name: 'com.eab.se&hl=en_US'
      },
      ios: {
        fallback_http_url: 'https://itunes.apple.com/us/app/navigate-student/id950433229?mt=8',
        app_link: 'guideeab://'
      }
    },
    [ThirdPartyIds.corq]: {
      android: {
        fallback_http_url:
          'https://play.google.com/store/apps/details?id=com.campuslabs.collegiatelink',
        package_name: 'com.campuslabs.collegiatelink'
      },
      ios: {
        fallback_http_url:
          'https://itunes.apple.com/us/app/corq-by-collegiatelink/id940682997?mt=8',
        app_link: 'corq://'
      }
    }
  };

  static thirdPartyTypeIdFromLinkParams(linkParams: IExternalAppOpenLinkParams): string {
    return Object.keys(ResourceExternalAppOpenUtils.thirdPartyShortcuts).find((thirdPartyId) =>
      isEqual(ResourceExternalAppOpenUtils.thirdPartyShortcuts[thirdPartyId], linkParams)
    );
  }

  constructor(private cpI18n: CPI18nService) {}

  getShortcutOptions() {
    return sortBy(
      [
        { action: null, label: this.cpI18n.translate('t_shared_custom') },
        { action: ThirdPartyIds.canvas, label: 'Canvas' },
        { action: ThirdPartyIds.orgSync, label: 'OrgSync' },
        { action: ThirdPartyIds.blackboardLearn, label: 'Blackboard Learn' },
        { action: ThirdPartyIds.blackboardInstructor, label: 'Blackboard Instructor' },
        { action: ThirdPartyIds.blackboardStudent, label: 'Blackboard Student' },
        { action: ThirdPartyIds.microsoftOutlook, label: 'Microsoft Outlook' },
        { action: ThirdPartyIds.reaveGuardian, label: 'Rave Guardian' },
        { action: ThirdPartyIds.powerSchool, label: 'Power School' },
        { action: ThirdPartyIds.moodle, label: 'Moodle' },
        { action: ThirdPartyIds.liveSafe, label: 'Live Safe' },
        { action: ThirdPartyIds.guideEab, label: 'Guide EAB' },
        { action: ThirdPartyIds.corq, label: 'Corq' }
      ],
      (option: IItem) => option.label
    );
  }
}
