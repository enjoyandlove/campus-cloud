import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { RatingScale, ServiceAttendance } from '@controlpanel/manage/services/services.status';

@Component({
  selector: 'cp-services-assessment-form',
  templateUrl: './services-assessment-form.component.html',
  styleUrls: ['./services-assessment-form.component.scss']
})
export class ServicesAssessmentFormComponent implements OnInit {
  @Input() formError;
  @Input() form: FormGroup;

  constructor(public cpI18n: CPI18nService) {}

  onToggleAttendance(value) {
    const serviceAttendance = value ? ServiceAttendance.enabled : ServiceAttendance.disabled;

    const feedbackLabel = !value
      ? null
      : this.cpI18n.translate('services_default_feedback_question');

    const maxScale = value ? RatingScale.maxScale : RatingScale.noScale;

    this.form.get('rating_scale_maximum').setValue(maxScale);
    this.form.get('service_attendance').setValue(serviceAttendance);
    this.form.get('default_basic_feedback_label').setValue(feedbackLabel);
  }

  ngOnInit() {}
}
