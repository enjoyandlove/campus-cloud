import { HttpParams } from '@angular/common/http';

import { EventIntegration } from '@libs/integrations/events/model';
import { ItemsIntegrationsUitlsService } from './items-integrations.utils.service';

describe('ItemsIntegrationsUitlsService', () => {
  it('should return default Event Integration params', () => {
    const schoolId = 157;
    const calendarId = 1;

    const result = ItemsIntegrationsUitlsService.commonParams(schoolId, calendarId);
    const expected = new HttpParams()
      .set('school_id', schoolId.toString())
      .set('academic_calendar_id', calendarId.toString())
      .set('feed_obj_type', EventIntegration.objectType.academicEvent.toString());

    expect(result.toString()).toEqual(expected.toString());
  });
});
