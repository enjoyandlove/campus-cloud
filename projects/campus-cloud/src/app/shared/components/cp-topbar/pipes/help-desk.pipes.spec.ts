import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';

import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { HelpDeskPipes } from '@campus-cloud/shared/components';

describe('CPHelpDeskPipes', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [HelpDeskPipes, CPI18nService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let pipe: HelpDeskPipes;

  beforeEach(async(() => {
    pipe = TestBed.get(HelpDeskPipes);
  }));

  it('should get last build time', () => {
    const expected = 'Jul 3, 2019';
    const lastBuildDate = '2019-07-03T12:28:07.389Z';
    const result = pipe.transform(lastBuildDate);

    expect(expected).toEqual(result);
  });

  it('should get last build time if number of days less than seven', () => {
    let expected = '10 minutes ago';
    let lastBuildDate = CPDate.localNow().subtract(10, 'minutes');
    let result = pipe.transform(lastBuildDate);

    expect(expected).toEqual(result);

    expected = '7 days ago';
    lastBuildDate = CPDate.localNow().subtract(7, 'days');
    result = pipe.transform(lastBuildDate);

    expect(expected).toEqual(result);
  });
});
