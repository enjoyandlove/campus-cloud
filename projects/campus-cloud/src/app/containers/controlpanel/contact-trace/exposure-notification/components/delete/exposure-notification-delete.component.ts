import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { HttpParams } from '@angular/common/http';
import {
  ExposureNotification,
  ExposureNotificationService
} from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-delete',
  templateUrl: './exposure-notification-delete.component.html',
  styleUrls: ['./exposure-notification-delete.component.scss']
})
export class ExposureNotificationDeleteComponent implements OnInit {
  @Input() notification: ExposureNotification;
  @Output() deleteForm: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private notificationService: ExposureNotificationService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    $('#notificationDeleteModal').modal('hide');
  }

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.notificationService.deleteNotification(this.notification.id, search).subscribe(
      (_) => {
        $('#notificationDeleteModal').modal('hide');

        this.deleteForm.emit(this.notification.id);

        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (err) => {
        $('#notificationDeleteModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
