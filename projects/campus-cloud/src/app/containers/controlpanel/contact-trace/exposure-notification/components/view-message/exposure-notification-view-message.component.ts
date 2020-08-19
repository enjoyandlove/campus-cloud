import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ExposureNotification } from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-view-message',
  templateUrl: './exposure-notification-view-message.component.html',
  styleUrls: ['./exposure-notification-view-message.component.scss']
})
export class ExposureNotificationViewMessageComponent implements OnInit {
  @Input() notification: ExposureNotification;

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    $('#viewMessageModal').modal('hide');
  }

  ngOnInit() {}
}
