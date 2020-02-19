import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants';

function getMenu(privileges = {}) {
  const form = {
    services: {
      active: false,
      deps: []
    },
    clubs: {
      active: false,
      deps: []
    },
    events: {
      active: false,
      deps: []
    },
    content: {
      orientation: {
        active: false,
        deps: []
      },
      calendars: {
        active: false,
        deps: []
      },
      maps: {
        active: false,
        deps: []
      },
      feeds: {
        active: false,
        deps: [CP_PRIVILEGES_MAP.membership],
        disables: [CP_PRIVILEGES_MAP.membership]
      },
      links: {
        active: false,
        deps: []
      },
      appCustomizaton: {
        active: false,
        deps: []
      },
      jobs: {
        active: false,
        deps: []
      },
      deals: {
        active: false,
        deps: []
      },
      dining: {
        active: false,
        deps: []
      },
      appUserManagement: {
        active: false,
        deps: []
      }
    },
    notify: {
      campus: {
        active: false,
        deps: [],
        disables: [CP_PRIVILEGES_MAP.assessment, CP_PRIVILEGES_MAP.emergency_announcement]
      },
      emergency: {
        active: false,
        deps: [CP_PRIVILEGES_MAP.campus_announcements]
      }
    },
    assess: {
      engagement: {
        active: false,
        deps: [CP_PRIVILEGES_MAP.campus_announcements]
      }
    }
  };

  Object.keys(privileges).forEach((p) => {
    if (+p === CP_PRIVILEGES_MAP.services) {
      form.services.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.clubs) {
      form.clubs.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.events) {
      form.events.active = true;
    }
    if (+p === 17) {
      form.content.orientation.active = true;
    }
    if (+p === 16) {
      form.content.calendars.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.campus_maps) {
      form.content.maps.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.moderation) {
      form.content.feeds.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.links) {
      form.content.links.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.app_customization) {
      form.content.appCustomizaton.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.campus_announcements) {
      form.notify.campus.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.emergency_announcement) {
      form.notify.emergency.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.assessment) {
      form.assess.engagement.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.jobs) {
      form.content.jobs.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.deals) {
      form.content.deals.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.dining) {
      form.content.dining.active = true;
    }
    if (+p === CP_PRIVILEGES_MAP.app_user_management) {
      form.content.appUserManagement.active = true;
    }
  });

  return form;
}

export const TEAM_ACCESS = {
  getMenu
};
