import { TestBed } from '@angular/core/testing';

import { mockLinkData } from './tiles/tests/mocks';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { TilesUtilsService } from './tiles/tiles.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { MockTilesUtilsService } from './mock/personas.service.mock';
import { PersonasAmplitudeService } from './personas.amplitude.service';
import { mockTile } from '@controlpanel/customise/personas/tiles/tests/mocks';

describe('PersonasAmplitudeService', () => {
  configureTestSuite();

  let service: PersonasAmplitudeService;

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        providers: [
          CPI18nService,
          PersonasAmplitudeService,
          { provide: TilesUtilsService, useClass: MockTilesUtilsService }
        ]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  beforeEach(() => {
    service = TestBed.get(PersonasAmplitudeService);
  });

  it('should get section type', () => {
    const sectionType = 'webLink';
    const result = amplitudeEvents.WEB_LINK;

    expect(PersonasAmplitudeService.getSectionType(sectionType)).toBe(result);
  });

  it('should get content type', () => {
    const linkData = {
      ...mockLinkData,
      link_url: null
    };

    let resourceType = 'resource';
    let result = amplitudeEvents.NO_CONTENT;
    let contentType = service.getContentType(linkData, resourceType);

    expect(contentType).toEqual(result);

    resourceType = 'resourceList';
    result = amplitudeEvents.MULTIPLE_RESOURCES;
    contentType = service.getContentType(mockLinkData, resourceType);

    expect(contentType).toEqual(result);

    resourceType = 'thirdPartyApp';
    result = amplitudeEvents.THIRD_PARTY_APP;
    contentType = service.getContentType(mockLinkData, resourceType);

    expect(contentType).toEqual(result);

    resourceType = 'singleItem';
    result = amplitudeEvents.CALENDAR;
    contentType = service.getContentType(mockLinkData, resourceType);

    expect(contentType).toEqual(result);
  });

  it('should get Tile amplitude properties', () => {
    const tile = {
      ...mockTile,
      related_link_data: mockLinkData
    };

    const expected = service.getTileAmplitudeProperties(tile);

    const result = {
      tile_id: 1,
      tile_type: 'Normal',
      tile_status: 'Shown',
      content_type: 'Calendar',
      section_type: 'Single Item'
    };

    expect(expected).toEqual(result);
  });
});
