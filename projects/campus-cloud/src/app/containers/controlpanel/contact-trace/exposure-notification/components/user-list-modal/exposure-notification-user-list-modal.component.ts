import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ExposureNotification } from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-user-list-modal',
  templateUrl: './exposure-notification-user-list-modal.component.html',
  styleUrls: ['./exposure-notification-user-list-modal.component.scss']
})
export class ExposureNotificationUserListModalComponent implements OnInit {
  @Input() notification: ExposureNotification;
  @Output() caseLinkClicked: EventEmitter<number> = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    $('#notificationUsersModal').modal('hide');
  }

  ngOnInit() {}
}
