import { IStudioContentResource } from './../providers';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { TilesUtilsService } from '../../../containers/controlpanel/customise/personas/tiles/tiles.utils.service';

export function getLinkUrlFromResourceList(resources: IStudioContentResource[]) {
  return resources.map((resource) => resource.meta.link_url);
}

export const campusLinks = [
  CampusLink.store,
  CampusLink.dining,
  CampusLink.jobList,
  CampusLink.appOpen,
  CampusLink.cameraQr,
  CampusLink.timetable,
  CampusLink.storeList,
  CampusLink.campusPoi,
  CampusLink.eventList,
  CampusLink.directory,
  CampusLink.examSearch,
  CampusLink.advisorList,
  CampusLink.courseSearch,
  CampusLink.campaignList,
  CampusLink.campusService,
  CampusLink.campusPoiList,
  CampusLink.inAppFeedback,
  CampusLink.dealStoreList,
  CampusLink.campusSecurity,
  CampusLink.campusLinkList,
  CampusLink.campusTourList,
  CampusLink.schoolCampaign,
  CampusLink.campusServiceList,
  CampusLink.integrationConfig,
  CampusLink.attendedEventList,
  CampusLink.serviceByCategoryId,
  CampusLink.subscribableCalendar,
  CampusLink.academicCalendarList,
  CampusLink.campusSecurityService,
  CampusLink.defaultCampusLinkList,
  CampusLink.orientationCalendarList,
  CampusLink.userOrientationCalendarList,
  CampusLink.userSchoolCourseMaterialList
];

export const campusLinkDetails = campusLinks.map((link) => {
  return {
    link,
    isPublic: !TilesUtilsService.loginRequiredTiles.includes(link),
    isWebSupported: TilesUtilsService.webAppSupportedLinkUrls.includes(link)
  };
});
