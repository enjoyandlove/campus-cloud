import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import {
  ExposureNotification,
  ExposureNotificationService
} from '@controlpanel/contact-trace/exposure-notification';
import { baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { AnnouncementPriority } from '@controlpanel/notify/announcements/model';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-exposure-notification-edit',
  templateUrl: './exposure-notification-edit.component.html',
  styleUrls: ['./exposure-notification-edit.component.scss']
})
export class ExposureNotificationEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  notification: ExposureNotification;
  webServiceCallInProgress: boolean;
  types = [
    {
      action: AnnouncementPriority.regular,
      disabled: false,
      label: this.cpI18n.translate('regular'),
      description: this.cpI18n.translate('announcements_regular_help')
    },
    {
      action: AnnouncementPriority.urgent,
      disabled: false,
      label: this.cpI18n.translate('urgent'),
      description: this.cpI18n.translate('announcements_urgent_help')
    },
    {
      action: AnnouncementPriority.emergency,
      disabled: false,
      label: this.cpI18n.translate('emergency'),
      description: this.cpI18n.translate('announcements_emergency_help')
    }
  ];
  selectedType;
  subject_prefix = {
    label: null,
    type: null
  };
  URGENT_TYPE = 1;
  REGULAR_TYPE = 2;
  EMERGENCY_TYPE = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: ExposureNotificationService,
    private store: Store<IHeader>,
    private router: Router,
    private cpI18n: CPI18nService
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

  cancelClickHandler(): void {
    this.router.navigate(['/contact-trace/exposure-notification']);
  }

  onSchedule(scheduledAt: number) {
    this.notification.notify_at_epoch = scheduledAt;
  }

  onTypeChanged(type): void {
    this.subject_prefix = {
      label: null,
      type: null
    };

    if (type.action === this.EMERGENCY_TYPE) {
      this.subject_prefix = {
        label: this.cpI18n.translate('emergency'),
        type: 'danger'
      };
    }

    if (type.action === this.URGENT_TYPE) {
      this.subject_prefix = {
        label: this.cpI18n.translate('urgent'),
        type: 'warning'
      };
    }

    this.notification.priority = type.action;
    this.selectedType = this.getObjectFromTypesArray(type.action);
  }

  private getObjectFromTypesArray(id) {
    let result;

    this.types.forEach((type) => {
      if (type.action === id) {
        result = type;
      }
    });

    return result;
  }
}
