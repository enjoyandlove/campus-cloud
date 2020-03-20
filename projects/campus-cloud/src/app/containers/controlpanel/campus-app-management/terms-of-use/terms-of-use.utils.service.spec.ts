import { TestBed, async } from '@angular/core/testing';

import { mockTerms, mockEditorContent } from './tests';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { TermsOfUseUtilsService } from './terms-of-use.utils.service';

describe('TermsOfUseUtilsService', () => {
  configureTestSuite();

  const regex = /\d{8}_[^\s]+_\d{8}/; // regex to match format i.e 12345678_hw_12345678

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [TermsOfUseUtilsService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(async(() => {}));

  it('getLinkPlaceholder', () => {
    const str = 'Hello World';
    const result = TermsOfUseUtilsService.getLinkPlaceholder(str);
    const expected = result.match(regex)[0];

    expect(result).toEqual(expected);
  });

  it('parseContentFromAPI', () => {
    const result = TermsOfUseUtilsService.parseContentFromAPI(mockTerms);

    expect(mockEditorContent).toEqual(result);
  });
});
