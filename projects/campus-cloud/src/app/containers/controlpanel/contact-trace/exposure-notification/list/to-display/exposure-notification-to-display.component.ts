import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExposureNotification } from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-to-display',
  templateUrl: './exposure-notification-to-display.component.html',
  styleUrls: ['./exposure-notification-to-display.component.scss']
})
export class ExposureNotificationToDisplayComponent implements OnInit {
  @Input() notification: ExposureNotification;
  @Output() caseLinkClicked: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
