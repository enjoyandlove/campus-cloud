import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { INotificationTemplate } from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';

@Component({
  selector: 'cp-notification-template-edit',
  templateUrl: './notification-template-edit.component.html',
  styleUrls: ['./notification-template-edit.component.scss']
})
export class NotificationTemplateEditComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<NotificationTemplateEditComponent>,
              @Inject(MAT_DIALOG_DATA) private data: INotificationTemplate) {

    this.form = this.formBuilder.group({
        subject: this.formBuilder.control(this.data.subject, Validators.required),
        message: this.formBuilder.control(this.data.message, Validators.required)
      }
    );
  }

  ngOnInit(): void {
  }

  onSave() {

  }

}
