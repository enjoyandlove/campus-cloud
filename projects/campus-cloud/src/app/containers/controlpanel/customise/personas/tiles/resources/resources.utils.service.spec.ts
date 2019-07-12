import { mockResource } from './__mock__';
import { mockPersonas } from '../../tests';
import { PersonasType } from '../../personas.status';
import { ResourcesUtilsService } from './resources.utils.service';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';

describe('ResourcesUtilsService', () => {
  let service: ResourcesUtilsService;

  beforeEach(() => {
    service = new ResourcesUtilsService();
  });

  it('should find correct types for mobile persona', () => {
    const nullType = service.getType({ ...mockPersonas[0] }, { ...mockResource });
    expect(nullType).toBe(null);

    const calendarType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: CampusLink.academicCalendarList
      }
    );
    expect(calendarType).toBe('academic_calendar');

    const externalType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'customurl',
        open_in_browser: true
      }
    );
    expect(externalType).toBe('external_link');

    const inappType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'customurl',
        open_in_browser: false
      }
    );
    expect(inappType).toBe('web_link');

    const listType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: CampusLink.campusLinkList
      }
    );
    expect(listType).toBe(null);
  });

  it('should find correct types for webapp persona', () => {
    const courseType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: CampusLink.courseSearch
      }
    );
    expect(courseType).toBe(null);

    const serviceType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: CampusLink.campusService
      }
    );
    expect(serviceType).toBe('campus_service');

    const listType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: CampusLink.campusLinkList
      }
    );
    expect(listType).toBe(null);
  });
});
