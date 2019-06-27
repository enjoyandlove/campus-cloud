import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, async } from '@angular/core/testing';

import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@projects/campus-cloud/src/app/shared/tests';
import { FeedIntegration } from './../model/integration.model';
import { CommonIntegrationUtilsService, ReponseErrors } from './integrations.utils.service';

describe('CommonIntegrationUtilsService', () => {
  let cpI18n: CPI18nService;
  let service: CommonIntegrationUtilsService;

  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [CommonIntegrationUtilsService, CPI18nService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(async(() => {
    service = TestBed.get(CommonIntegrationUtilsService);
    cpI18n = TestBed.get(CPI18nService);
  }));

  it('should return type menu', () => {
    const result = CommonIntegrationUtilsService.typesDropdown();

    expect(result.length).toBe(3);
  });

  it('should have right items in dropdown', () => {
    const result = CommonIntegrationUtilsService.typesDropdown();
    const labels = result.map((r) => r.label);
    const actions = result.map((r) => r.action);

    const expectedLabels = ['RSS', 'Atom', 'iCal'];

    const expectedActions = [
      FeedIntegration.types.rss,
      FeedIntegration.types.atom,
      FeedIntegration.types.ical
    ];

    expect(labels).toEqual(expectedLabels);
    expect(actions).toEqual(expectedActions);
  });

  it('should return generic error', () => {
    const error = new HttpErrorResponse({ error: 'didnt quite work' });
    const expected = cpI18n.translate('something_went_wrong');
    const result = service.handleCreateUpdateError(error).error;

    expect(result).toEqual(expected);
  });

  it('should return duplicate feed error', () => {
    const error = new HttpErrorResponse({ error: ReponseErrors.duplicate_feed_url_in_school });
    const expected = cpI18n.translate('t_shared_integration_create_error_duplicate_feed_url');
    const result = service.handleCreateUpdateError(error).error;

    expect(result).toEqual(expected);
  });
});
