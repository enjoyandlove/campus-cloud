import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INotificationTemplate } from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-notification-template-edit',
  templateUrl: './notification-template-edit.component.html',
  styleUrls: ['./notification-template-edit.component.scss']
})
export class NotificationTemplateEditComponent {

  form: FormGroup;
  template: INotificationTemplate;
  envRootPath = environment.root;

  constructor(private formBuilder: FormBuilder,
              @Inject(READY_MODAL_DATA) public modal: any) {
    this.template = this.modal.data;
    this.form = this.formBuilder.group({
        subject: this.formBuilder.control(this.modal.data.subject, Validators.compose([
          Validators.required,
          Validators.maxLength(2048)
        ])),
        message: this.formBuilder.control(this.modal.data.message, Validators.compose([
          Validators.required,
          Validators.maxLength(2048)
        ]))
      }
    );
  }

  onSave() {
    this.template = { ...this.template, ...this.form.value};
    this.modal.onAction(this.template);
  }

}
