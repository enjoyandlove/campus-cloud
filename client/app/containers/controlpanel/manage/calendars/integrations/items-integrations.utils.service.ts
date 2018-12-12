import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EventIntegration } from '@libs/integrations/events/model';

@Injectable()
export class ItemsIntegrationsUitlsService {
  static commonParams(schoolId, calendarId): HttpParams {
    return new HttpParams()
      .set('school_id', schoolId)
      .set('academic_calendar_id', calendarId)
      .set('feed_obj_type', EventIntegration.objectType.academicEvent.toString());
  }
}
