import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { CPDatePipe } from '@campus-cloud/shared/pipes';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { CPHelpDeskPipes } from '@campus-cloud/shared/components';

describe('CPHelpDeskPipes', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [CPHelpDeskPipes, CPDatePipe, CPSession]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let pipe: CPHelpDeskPipes;

  beforeEach(async(() => {
    pipe = TestBed.get(CPHelpDeskPipes);
  }));

  it('should get last build time', () => {
    const expected = 'Jul 3, 2019';
    const lastBuildDate = '2019-07-03T12:28:07.389Z';
    const result = pipe.transform(lastBuildDate);

    expect(expected).toEqual(result);
  });
});
