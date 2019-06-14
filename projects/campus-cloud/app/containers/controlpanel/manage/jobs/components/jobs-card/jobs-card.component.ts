import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-jobs-card',
  templateUrl: './jobs-card.component.html',
  styleUrls: ['./jobs-card.component.scss']
})
export class JobsCardComponent {
  @Input() form: FormGroup;
  @Input() employerForm: FormGroup;

  @Output()
  formData: EventEmitter<{
    job: any;
    jobFormValid: boolean;
    employer: any;
    employerFormValid: boolean;
  }> = new EventEmitter();
}
