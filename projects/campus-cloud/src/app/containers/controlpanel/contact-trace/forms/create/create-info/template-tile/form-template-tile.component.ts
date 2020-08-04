import { Component, Input, OnInit } from '@angular/core';
import { Form, FormType } from '../../../models';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-form-template-tile',
  templateUrl: './form-template-tile.component.html',
  styleUrls: ['./form-template-tile.component.scss']
})
export class FormTemplateTileComponent implements OnInit {
  @Input() form: Form;
  @Input() selected: boolean;
  formType = FormType;
  scratchImage = `${environment.root}assets/svg/contact-trace/forms/template-start-scratch.svg`;
  preScreeningImage = `${environment.root}assets/svg/contact-trace/forms/template-pre-screening.svg`;
  symptomTrackerImage = `${environment.root}assets/svg/contact-trace/forms/template-symptom-tracker.svg`;
  selfReportingImage = `${environment.root}assets/svg/contact-trace/forms/template-self-reporting.svg`;
  genericImage = `${environment.root}assets/svg/contact-trace/forms/template-generic.svg`;

  constructor() {}

  ngOnInit(): void {}
}
