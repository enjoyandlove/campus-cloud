import { EventIntegration } from './model/integration.model';
import { IntegrationsUtilsService } from './integrations.utils.service';
describe('IntegrationsUtilsService', () => {
  let service: IntegrationsUtilsService;

  beforeEach(() => {
    service = new IntegrationsUtilsService();
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
      EventIntegration.types.rss,
      EventIntegration.types.atom,
      EventIntegration.types.ical
    ];

    expect(labels).toEqual(expectedLabels);
    expect(actions).toEqual(expectedActions);
  });
});
