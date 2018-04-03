import { Component } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { OrientationFeedbackService } from '../orientation.feedback.service';

@Component({
  selector: 'cp-orientation-feedback-event',
  template: `<cp-feedback-event></cp-feedback-event>`,
  providers: [{provide: FeedbackService, useClass: OrientationFeedbackService}]
})

export class FeedbackOrientationEventComponent {
  constructor() {}

}
