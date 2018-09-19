import { Injectable } from '@angular/core';

import {
  HasData,
  Feedback,
  Assessment,
  ServiceFeedback,
  ServiceAttendance
} from './services.status';

@Injectable()
export class ServicesUtilsService {
  hasData(data) {
    return data ? HasData.yes : HasData.no;
  }

  getFeedbackStatus(feedback) {
    return feedback === ServiceFeedback.enabled ? Feedback.enabled : Feedback.disabled;
  }

  getAssessmentStatus(assessment) {
    return assessment === ServiceAttendance.enabled ? Assessment.on : Assessment.off;
  }

  setEventProperties(data, service_id) {
    return {
      service_id,
      email: this.hasData(data.email),
      phone: this.hasData(data.contactphone),
      website: this.hasData(data.website),
      location: this.hasData(data.location),
      feedback: this.getFeedbackStatus(data.enable_feedback),
      assessment: this.getAssessmentStatus(data.service_attendance)
    };
  }
}
