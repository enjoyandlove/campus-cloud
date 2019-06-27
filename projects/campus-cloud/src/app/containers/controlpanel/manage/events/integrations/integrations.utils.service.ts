import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';

@Injectable()
export class IntegrationsUitlsService {
  static commonParams(schoolId): HttpParams {
    return new HttpParams()
      .set('school_id', schoolId)
      .set('feed_obj_type', EventIntegration.objectType.campusEvent.toString());
  }
}
