import { HttpParams } from '@angular/common/http';

import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { IntegrationsUitlsService } from './integrations.utils.service';

describe('IntegrationsUitlsService', () => {
  it('should return default Event Integration params', () => {
    const schoolId = 157;

    const result = IntegrationsUitlsService.commonParams(schoolId);
    const expected = new HttpParams()
      .set('school_id', schoolId.toString())
      .set('feed_obj_type', EventIntegration.objectType.campusEvent.toString());

    expect(result.toString()).toEqual(expected.toString());
  });
});
