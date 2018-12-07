import { CommonIntegrationUtilsService } from './integrations.utils.service';
import { FeedIntegration } from './../model/integration.model';

describe('CommonIntegrationUtilsService', () => {
  let service: CommonIntegrationUtilsService;

  beforeEach(() => {
    service = new CommonIntegrationUtilsService();
  });

  it('should return type menu', () => {
    const result = service.typesDropdown();

    expect(result.length).toBe(3);
  });

  it('should have right items in dropdown', () => {
    const result = service.typesDropdown();
    const labels = result.map((r) => r.label);
    const actions = result.map((r) => r.action);

    const expectedLabels = ['RSS', 'ATOM', 'ICAL'];

    const expectedActions = [
      FeedIntegration.types.rss,
      FeedIntegration.types.atom,
      FeedIntegration.types.ical
    ];

    expect(labels).toEqual(expectedLabels);
    expect(actions).toEqual(expectedActions);
  });
});
