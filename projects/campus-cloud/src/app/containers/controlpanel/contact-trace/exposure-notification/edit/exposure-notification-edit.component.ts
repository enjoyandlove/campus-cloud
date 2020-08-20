import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import {
  ExposureNotification,
  ExposureNotificationService
} from '@controlpanel/contact-trace/exposure-notification';
import { baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cp-exposure-notification-edit',
  templateUrl: './exposure-notification-edit.component.html',
  styleUrls: ['./exposure-notification-edit.component.scss']
})
export class ExposureNotificationEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  notification: ExposureNotification;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: ExposureNotificationService,
    private store: Store<IHeader>
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      const notificationId: number = Number(params['notificationId']);
      this.getItemForEdit(notificationId).subscribe((notification) => {
        this.notification = notification;
        this.buildHeader();
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

  private buildHeader() {
    const payload = {
      heading: 'contact_trace_notification_notify',
      em: null,
      crumbs: {
        url: 'exposure-notification',
        label: 'contact_trace_forms_exposure_notification'
      },
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }
}
