import { FormBuilder } from '@angular/forms';

import { mockTile } from './tests/mocks';
import { CPSession } from '@campus-cloud/session';
import { mockSection } from './../sections/__mock__';
import { MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { TilesUtilsService } from './tiles.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { SectionUtilsService } from '../sections/section.utils.service';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { CampusLinkType, TileVisibility, TileCategoryRank } from './tiles.status';

const session = new CPSession();
session.g.set('school', mockSchool);

function createFile(mimeType = 'plain/txt', size = 1024) {
  function range(count) {
    let output = '';
    for (let i = 0; i < count; i++) {
      output += 'a';
    }

    return output;
  }

  const blob = new Blob([range(size)], { type: mimeType });

  return blob;
}

describe('TilesUtilsService', () => {
  let service: TilesUtilsService;

  beforeEach(() => {
    service = new TilesUtilsService(
      new FormBuilder(),
      session,
      new CPI18nService(),
      new SectionUtilsService(new CPI18nService())
    );
  });

  it('should have a list of supported web links', () => {
    expect(Array.isArray(TilesUtilsService.webAppSupportedLinkUrls)).toBe(true);
    expect(TilesUtilsService.webAppSupportedLinkUrls).toBeDefined();
  });

  it('should have a list of deprecated links', () => {
    expect(Array.isArray(TilesUtilsService.deprecatedTiles)).toBe(true);
    expect(TilesUtilsService.deprecatedTiles).toBeDefined();
  });

  it('should check if tile is in default category', () => {
    expect(service.isTileDefault(mockTile)).toBe(false);

    const defaultTile = {
      ...mockTile,
      tile_category_id: 2
    };

    expect(service.isTileDefault(defaultTile)).toBe(true);
  });

  it('should check if tile is web link', () => {
    const inApp = service.isTileWebLink(CampusLinkType.inAppLink);
    const web = service.isTileWebLink(CampusLinkType.webLink);

    expect(web).toBe(true);
    expect(inApp).toBe(false);
    expect(service.isTileWebLink(9999)).toBe(false);
  });

  it('should check if tile is supported by webapp', () => {
    const tileWithNoRelatedLinkData = service.isTileSupportedByWebApp(mockTile);

    const supportedTile = {
      ...mockTile,
      related_link_data: {
        link_url: TilesUtilsService.webAppSupportedLinkUrls[0]
      }
    };

    const webTile = {
      ...mockTile,
      related_link_data: {
        link_url: 'http://google.com',
        link_type: CampusLinkType.webLink
      }
    };

    const expectedTrue = service.isTileSupportedByWebApp(supportedTile);

    expect(tileWithNoRelatedLinkData).toBe(false);

    expect(expectedTrue).toBe(true);

    expect(service.isTileSupportedByWebApp(webTile)).toBe(true);
  });

  it('should check if a tile is of type campaign', () => {
    const tileWithNoRelatedLinkData = service.isCampaignTile(mockTile);

    const schoolCampaign = {
      ...mockTile,
      related_link_data: {
        link_url: CampusLink.schoolCampaign
      }
    };

    const campaignListTile = {
      ...mockTile,
      related_link_data: {
        link_url: CampusLink.campaignList
      }
    };

    expect(tileWithNoRelatedLinkData).toBe(false);

    expect(service.isCampaignTile(schoolCampaign)).toBe(true);

    expect(service.isCampaignTile(campaignListTile)).toBe(true);
  });

  it('should check if tile is deprecated', () => {
    const tileWithNoRelatedLinkData = service.isDeprecated(mockTile);

    const nonDeprecatedTile = {
      ...mockTile,
      related_link_data: {
        link_url: CampusLink.eventList
      }
    };

    const deprecatedTile = {
      ...mockTile,
      related_link_data: {
        link_url: CampusLink.cameraQr
      }
    };

    expect(tileWithNoRelatedLinkData).toBe(false);

    expect(service.isDeprecated(nonDeprecatedTile)).toBe(false);
    expect(service.isDeprecated(deprecatedTile)).toBe(true);
  });

  it('should check if tile is featured', () => {
    const nonFeatured = { ...mockTile };
    const featured = { ...mockTile, featured_rank: 1 };

    expect(service.isFeatured(nonFeatured)).toBe(false);

    expect(service.isFeatured(featured)).toBe(true);
  });

  it('should check tiles visibility', () => {
    const visibleTile = { ...mockTile };

    const hiddenTile = {
      ...mockTile,
      visibility_status: TileVisibility.invisible
    };

    expect(service.isTileVisible(hiddenTile)).toBe(false);

    expect(service.isTileVisible(visibleTile)).toBe(true);
  });

  it('should return a guide tile form', () => {
    const expected = {
      school_id: 157,
      school_persona_id: 1,
      name: 'Mock Tile',
      rank: 1,
      img_url: MOCK_IMAGE,
      color: mockSchool.branding_color,
      extra_info: {},
      visibility_status: 1,
      tile_category_id: 1,
      featured_rank: -1
    };

    expect(service.campusGuideTileForm(1, mockSection, mockTile).value).toEqual(expected);

    const featuredGuide = {
      ...mockSection,
      _featuredTile: true,
      tiles: mockSection.tiles.map((t, index) => {
        return {
          ...t,
          featured_rank: index + 1
        };
      })
    };

    const featuedGuideTileForm = service.campusGuideTileForm(1, featuredGuide).value;

    expect(featuedGuideTileForm.rank).toBe(TileCategoryRank.hidden);

    expect(featuedGuideTileForm.tile_category_id).toBe(0);

    expect(featuedGuideTileForm.featured_rank).toBe(featuredGuide.tiles.length + 1);
  });

  it('should get next available featured rank', () => {
    const guide = {
      ...mockSection,
      tiles: mockSection.tiles.map((t, index) => {
        return {
          ...t,
          featured_rank: index + 1
        };
      })
    };

    const guideWithNoTiles = {
      ...mockSection,
      tiles: []
    };

    expect(service.getLastFeaturedRank(guideWithNoTiles)).toBe(1);
    expect(service.getLastFeaturedRank(guide)).toBe(guide.tiles.length + 1);
  });

  it('shold get next available rank', () => {
    const tempGuide = { ...mockSection, _temporary: true };
    const noTilesGuide = { ...mockSection, tiles: [] };
    const guide = {
      ...mockSection,
      tiles: mockSection.tiles.map((t, index) => {
        return {
          ...t,
          rank: index + 1
        };
      })
    };

    expect(service.getLastRank(tempGuide)).toBe(1);
    expect(service.getLastRank(noTilesGuide)).toBe(1);
    expect(service.getLastRank(guide)).toBe(guide.tiles.length + 1);
  });
});
