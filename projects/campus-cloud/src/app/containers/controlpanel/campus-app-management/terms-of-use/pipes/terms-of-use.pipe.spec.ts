import { TestBed, async } from '@angular/core/testing';

import { TermsOfUsePipe } from './terms-of-use.pipe';
import { mockDisclaimerText as expected } from '../tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';

describe('TermsOfUsePipe', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [TermsOfUsePipe, CPI18nService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let pipe: TermsOfUsePipe;

  beforeEach(async(() => {
    pipe = TestBed.get(TermsOfUsePipe);
  }));

  it('should replace phraseapp key placeholder to links', () => {
    const key = 't_terms_of_use_disclaimer';

    const result = pipe.transform(key);

    expect(expected).toEqual(result);
  });
});
