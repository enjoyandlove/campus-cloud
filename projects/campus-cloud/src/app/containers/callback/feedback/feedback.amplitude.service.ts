import { Injectable } from '@angular/core';

const rating = {
  20: '1 Star',
  40: '2 Stars',
  60: '3 Stars',
  80: '4 Stars',
  100: '5 Stars'
};

const assessmentType = {
  0: 'Club Event',
  16: 'Athletic Event',
  19: 'Service Event'
};

@Injectable({
  providedIn: 'root'
})
export class FeedbackAmplitudeService {
  static getAssessmentType(data, isProvider) {
    if (isProvider) {
      return 'Service Provider';
    }

    const assessType = assessmentType[data['store_category']];

    return assessType ? assessType : 'Orientation Event';
  }

  static getFeedbackAmplitude(data, event, source_id, isProvider = false) {
    return {
      source_id,
      rating: rating[data['user_rating_percent']],
      assessment_type: this.getAssessmentType(event, isProvider)
    };
  }
}
