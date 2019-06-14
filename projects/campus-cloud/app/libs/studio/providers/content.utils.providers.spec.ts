import { async, TestBed } from '@angular/core/testing';

import { CPI18nService } from '@shared/services';
import { mockStudioContentResource } from './../tests/mocks';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { ContentUtilsProviders } from './content.utils.providers';

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

  describe('isLoginRequired', () => {
    it('should return false if object has no link_url', () => {
      const result = ContentUtilsProviders.isLoginRequired(mockStudioContentResource);

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

      const result = ContentUtilsProviders.isLoginRequired(resource);

      expect(result).toBe(false);
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
