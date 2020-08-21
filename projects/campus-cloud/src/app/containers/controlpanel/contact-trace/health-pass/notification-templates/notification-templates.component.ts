import { Component, OnInit } from '@angular/core';
import {
  INotificationTemplate,
} from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';
import { NotificationTemplateEditComponent } from '@controlpanel/contact-trace/health-pass/notification-templates/edit';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'cp-notification-templates',
  templateUrl: './notification-templates.component.html',
  styleUrls: ['./notification-templates.component.scss']
})
export class NotificationTemplatesComponent implements OnInit {

  templates: INotificationTemplate[];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.templates = [
      {
        type: 1,
        name: 'Clear',
        subject: 'Clear Subject',
        message: 'Clear Message'
      },
      {
        type: 1,
        name: 'Clear 2',
        subject: 'Clear Subject',
        message: 'Clear Message'
      },
      {
        type: 1,
        name: 'Clear 3',
        subject: 'Clear Subject',
        message: 'Clear Message'
      }
    ];
  }

  openEditModal(template: INotificationTemplate) {
    const dialogRef = this.dialog.open(NotificationTemplateEditComponent, {
      width: '500px',
      data: template
    });
  }
}
