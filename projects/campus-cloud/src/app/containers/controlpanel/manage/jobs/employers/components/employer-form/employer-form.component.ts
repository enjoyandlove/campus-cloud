import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.scss']
})
export class EmployerFormComponent {
  @Input() formError;
  @Input() employerForm;

  constructor() {}

  onUploadedImage(image) {
    this.employerForm.controls['logo_url'].setValue(image);
  }
}
