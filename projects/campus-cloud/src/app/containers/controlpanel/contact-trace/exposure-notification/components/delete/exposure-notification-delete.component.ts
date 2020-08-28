import { Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { HttpParams } from '@angular/common/http';
import { ExposureNotification } from '@controlpanel/contact-trace/exposure-notification/models';
import { ExposureNotificationService } from '@controlpanel/contact-trace/exposure-notification/services';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays';

@Component({
  selector: 'cp-exposure-notification-delete',
  templateUrl: './exposure-notification-delete.component.html',
  styleUrls: ['./exposure-notification-delete.component.scss']
})
export class ExposureNotificationDeleteComponent implements OnInit {
  notification: ExposureNotification;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private cpTracking: CPTrackingService,
    private notificationService: ExposureNotificationService,
    @Inject(READY_MODAL_DATA) public modal: any
  ) {
    this.notification = this.modal.data;
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.modal.onClose();
    }
  }

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.notificationService.deleteNotification(this.notification.id, search).subscribe(
      (_) => {
        $('#notificationDeleteModal').modal('hide');

        this.modal.onAction(this.notification.id);
      },
      (err) => {
        this.modal.onClose();
      }
    );
  }

  ngOnInit() {
  }
}
