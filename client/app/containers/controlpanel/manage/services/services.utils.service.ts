import { Injectable } from '@angular/core';

import {
  hasData,
  Feedback,
  Assessment,
  ServiceFeedback,
  ServiceAttendance
} from './services.status';

@Injectable()
export class ServicesUtilsService {

  getData(data) {
    return data ? hasData.yes : hasData.no;
  }

  getFeedback(feedback) {
    return feedback === ServiceFeedback.enabled ? Feedback.enabled : Feedback.disabled;
  }

  getAssessment(assessment) {
    return assessment === ServiceAttendance.enabled ? Assessment.on : Assessment.off;
  }

  setEventProperties(data, service_id) {
    return {
      service_id,
      email: this.getData(data.email),
      phone: this.getData(data.contactphone),
      website: this.getData(data.website),
      location: this.getData(data.location),
      feedback: this.getFeedback(data.enable_feedback),
      assessment: this.getAssessment(data.service_attendance)
    };
  }

  setServiceProviderEventProperties(data) {
    return {
      visits: this.getData(data.total_visits),
      ratings: this.getData(data.num_ratings),
      service_id: data.campus_service_id,
      service_provider_id: data.id
    };
  }
}
