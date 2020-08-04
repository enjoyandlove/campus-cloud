import { async, TestBed } from '@angular/core/testing';

import { mockStudioContentResource } from '../../tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ContentUtilsProviders } from './content.utils.providers';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';

describe('ResourceTypeServiceByCategoryComponent', () => {
  let service: ContentUtilsProviders;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService, ContentUtilsProviders]
    });
  }));

  beforeEach(() => {
    service = TestBed.get(ContentUtilsProviders);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of available content types', () => {
    const contentTypes = ContentUtilsProviders.contentTypes;

    expect(Object.keys(contentTypes).length).toBe(5);
  });

  describe('isWebAppContent', () => {
    it('should return false if object has no link_url', () => {
      const result = ContentUtilsProviders.isWebAppContent(mockStudioContentResource);

      expect(result).toBe(false);
    });

    it('should call TilesUtilsService.webAppSupportedLinkUrls when object is valid', () => {
      const resource = {
        ...mockStudioContentResource,
        meta: {
          link_params: {},
          link_url: CampusLink.dining
        }
      };

      const result = ContentUtilsProviders.isWebAppContent(resource);

      expect(result).toBe(true);
    });
  });

  describe('getResourcesForType', () => {
    it('should return resource type items', () => {
      const type = ContentUtilsProviders.contentTypes.list;
      const contentTypes = ContentUtilsProviders.getResourcesForType(type);
      const resultLinksUrls = contentTypes.map((c) => c.meta.link_url);

      const resourceTypeLinkUrls = [
        CampusLink.dining,
        CampusLink.jobList,
        CampusLink.follett,
        CampusLink.eventList,
        CampusLink.storeList,
        CampusLink.storeList,
        CampusLink.directory,
        CampusLink.timetable,
        CampusLink.enrollment,
        CampusLink.integration,
        CampusLink.courseSearch,
        CampusLink.dealStoreList,
        CampusLink.campusPoiList,
        CampusLink.campusServiceList,
        CampusLink.academicCalendarList,
        CampusLink.orientationCalendarList,
        CampusLink.userOrientationCalendarList
      ];

      expect(contentTypes.length).toBe(27);

      resultLinksUrls.forEach((linkUrl) => {
        expect(resourceTypeLinkUrls.includes(linkUrl)).toBe(true, `${linkUrl} missing`);
      });
    });

    it('should return single resource type items', () => {
      const type = ContentUtilsProviders.contentTypes.single;
      const contentTypes = ContentUtilsProviders.getResourcesForType(type);
      const resultLinksUrls = contentTypes.map((c) => c.meta.link_url);

      const resourceTypeLinkUrls = [
        CampusLink.store,
        CampusLink.campusService,
        CampusLink.subscribableCalendar,
        CampusLink.form
      ];

      expect(contentTypes.length).toBe(4);

      resultLinksUrls.forEach((linkUrl) => {
        expect(resourceTypeLinkUrls.includes(linkUrl)).toBe(true, `${linkUrl} missing`);
      });
    });

    it('should return web type items', () => {
      const type = ContentUtilsProviders.contentTypes.web;
      const contentTypes = ContentUtilsProviders.getResourcesForType(type);

      expect(contentTypes.length).toBe(3);
    });

    it('should return third party type items', () => {
      const type = ContentUtilsProviders.contentTypes.thirdParty;
      const contentTypes = ContentUtilsProviders.getResourcesForType(type);
      const resultLinksUrls = contentTypes.map((c) => c.meta.link_url);

      const resourceTypeLinkUrls = [CampusLink.appOpen];

      expect(contentTypes.length).toBe(1);

      resultLinksUrls.forEach((linkUrl) => {
        expect(resourceTypeLinkUrls.includes(linkUrl)).toBe(true, `${linkUrl} missing`);
      });
    });
  });

  describe('isLoginRequired', () => {
    it('should return true if object has no link_url', () => {
      const result = ContentUtilsProviders.isPublicContent(mockStudioContentResource);

      expect(result).toBe(true);
    });

    it('should call TilesUtilsService.webAppSupportedLinkUrls when object is valid', () => {
      const resource = {
        ...mockStudioContentResource,
        meta: {
          link_params: {},
          link_url: CampusLink.dining
        }
      };

      const result = ContentUtilsProviders.isPublicContent(resource);

      expect(result).toBe(true);
    });
  });

  describe('getContentTypeByCampusLink', () => {
    const resource = {
      ...mockStudioContentResource,
      meta: {
        link_params: {},
        link_url: CampusLink.dining
      }
    };

    it('it should return content type id given a valid studio content resource object ', () => {
      const result = ContentUtilsProviders.getContentTypeByCampusLink(resource);
      expect(result).toBeDefined();
    });
  });
});
