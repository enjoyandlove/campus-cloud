const getMenu = function getMenu(privileges) {
  let form = {
    services: false,
    clubs: false,
    events: false,
    content: {
      orientation: false,
      calendars: false,
      maps: false,
      feeds: false,
      links: false,
      appCustomizaton: false,
    },
    notify: {
      campus: false,
      emergency: false
    },
    assess: {
      engagement: false
    }
  };

  Object.keys(privileges).forEach(p => {
    if (+p === 24) {
      form.services = true;
    }
    if (+p === 22) {
      form.clubs = true;
    }
    if (+p === 18) {
      form.events = true;
    }
    if (+p === 17) {
      form.content.orientation = true;
    }
    if (+p === 16) {
      form.content.calendars = true;
    }
    if (+p === 21) {
      form.content.maps = true;
    }
    if (+p === 15) {
      form.content.feeds = true;
    }
    if (+p === 23) {
      form.content.links = true;
    }
    if (+p === 13) {
      form.content.appCustomizaton = true;
    }
    if (+p === 12) {
      form.notify.campus = true;
    }
    if (+p === 32) {
      form.notify.emergency = true;
    }
    if (+p === 34) {
      form.assess.engagement = true;
    }
  });

  return form;
};

export const TEAM_ACCESS = {
  getMenu,
};
