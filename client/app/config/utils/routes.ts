import { CP_PRIVILEGES_MAP } from './../../shared/constants/privileges';

const protectedRoutes = ['events', 'feeds', 'clubs', 'services', 'lists',
                         'links', 'announcements', 'templates'];

const routeToPrivilege = {
  'events': CP_PRIVILEGES_MAP.events,

  'feeds': CP_PRIVILEGES_MAP.moderation,

  'clubs': CP_PRIVILEGES_MAP.clubs,

  'services': CP_PRIVILEGES_MAP.services,

  'lists': CP_PRIVILEGES_MAP.campus_announcements,

  'links': CP_PRIVILEGES_MAP.links,

  'announcements': CP_PRIVILEGES_MAP.campus_announcements,

  'templates': CP_PRIVILEGES_MAP.campus_announcements,
}

export const canCurrentUserLoadRoute = (path) => {
  if (protectedRoutes.includes(path)) {
    let canAccess;

    const schoolLevel = this.session.canSchoolReadResource(routeToPrivilege[path]);
    const accountLevel = this.session.canAccountLevelReadResource(routeToPrivilege[path]);

    canAccess = schoolLevel || accountLevel

    return canAccess;
  }
  return false
}

// if (childRoute.url.length) {
//   const path = childRoute.url[0].path;

//   if (protectedRoutes.includes(path)) {
//     let canAccess;

//     const schoolLevel = this.session.canSchoolReadResource(routeToPrivilege[path]);
//     const accountLevel = this.session.canAccountLevelReadResource(routeToPrivilege[path]);

//     canAccess = schoolLevel || accountLevel

//     if (!canAccess) {
//       this.router.navigate(['/welcome']);
//     }
//     return canAccess;
//   }
// }
// return true;
