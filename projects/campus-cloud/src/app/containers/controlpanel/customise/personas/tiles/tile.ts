const oohlala = 'oohlala://';
const inapp = 'in_app://';

export class CampusLink {
  public static readonly courseSearch = `${oohlala}course_search`;

  public static readonly examSearch = `${oohlala}exam_search`;

  public static readonly subscribableCalendar = `${oohlala}subscribable_calendar`;

  public static readonly academicCalendarList = `${oohlala}academic_calendar_list`;

  public static readonly userOrientationCalendarList = `${oohlala}user_orientation_calendar_list`;

  public static readonly campusSecurity = `${oohlala}campus_security`;

  public static readonly timetable = `${oohlala}timetable`;

  public static readonly userSchoolCourseMaterialList = `${oohlala}user_school_course_material_list`;

  public static readonly campusLinkList = `${oohlala}campus_link_list`;

  public static readonly campusService = `${oohlala}campus_service`;

  public static readonly campusServiceList = `${oohlala}campus_service_list`;

  public static readonly store = `${oohlala}store`;

  public static readonly storeList = `${oohlala}store_list`;

  public static readonly campusPoiList = `${oohlala}campus_poi_list`;

  public static readonly campusPoi = `${oohlala}campus_poi`;

  public static readonly campusTourList = `${oohlala}campus_tour_list`;

  public static readonly schoolCampaign = `${oohlala}school_campaign`;

  public static readonly campusSecurityService = `${oohlala}campus_security_service`;

  public static readonly inAppFeedback = `${oohlala}in_app_feedback`;

  public static readonly advisorList = `${oohlala}advisor_list`;

  public static readonly integrationConfig = `${oohlala}integration_config`;

  public static readonly cameraQr = `${oohlala}camera_qr`;

  public static readonly attendedEventList = `${oohlala}attended_event_list`;

  public static readonly orientationCalendarList = `${oohlala}orientation_calendar_list`;

  public static readonly eventList = `${oohlala}event_list`;

  public static readonly defaultCampusLinkList = `${oohlala}default_campus_link_list`;

  public static readonly dealStoreList = `${oohlala}deal_store_list`;

  public static readonly jobList = `${oohlala}job_list`;

  public static readonly campaignList = `${oohlala}campaign_list`;

  public static readonly serviceByCategoryId = `${oohlala}service_by_category_id`;

  public static readonly dining = `${oohlala}campus_poi_list/dining`;

  public static readonly appOpen = `open_external_app`;

  public static readonly directory = `${inapp}int_web_directory`;

  public static readonly linkType = {
    appOpen: 4,
    inAppLink: 3,
    regularWebLink: 0,
    externalWebApp: 5
  };
}
