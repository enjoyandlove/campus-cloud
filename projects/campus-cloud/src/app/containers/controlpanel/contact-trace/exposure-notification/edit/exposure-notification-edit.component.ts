import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import {
  ExposureNotification,
  ExposureNotificationService
} from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-edit',
  templateUrl: './exposure-notification-edit.component.html',
  styleUrls: ['./exposure-notification-edit.component.scss']
})
export class ExposureNotificationEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  notificationId: number;
  notification: ExposureNotification;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: ExposureNotificationService
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.notificationId = Number(params['notificationId']);
      this.getItemForEdit(this.notificationId).subscribe((notification) => {
        this.notification = notification;
        console.log('this.notification', this.notification);
      });
    });
  }

  private getItemForEdit(notificationId: number): Observable<ExposureNotification> {
    if (!notificationId) {
      const newObj: ExposureNotification = {
        type: 1
      };
      return of(newObj);
    }
    return this.notificationService.getNotification(notificationId);
  }
}
