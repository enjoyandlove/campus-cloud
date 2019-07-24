import { async, TestBed } from '@angular/core/testing';

import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@projects/campus-cloud/src/app/shared/tests';
import { ResourceExternalAppOpenUtils } from './resource-external-app-open.utils.service';

describe('ResourceExternalAppOpenUtils', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [ResourceExternalAppOpenUtils, CPI18nService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let service: ResourceExternalAppOpenUtils;

  beforeEach(async(() => {
    service = TestBed.get(ResourceExternalAppOpenUtils);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('thirdPartyTypeIdFromLinkParams', () => {
    it('should return the right type id for a given shortcut', () => {
      Object.keys(ResourceExternalAppOpenUtils.thirdPartyShortcuts).forEach(
        (thirdPartyId: string) => {
          const result = ResourceExternalAppOpenUtils.thirdPartyTypeIdFromLinkParams(
            ResourceExternalAppOpenUtils.thirdPartyShortcuts[thirdPartyId]
          );

          expect(result).toBeDefined();
        }
      );
    });
  });
});
