import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { NotificationTemplateApiActions, NotificationTemplatePageActions } from '@controlpanel/contact-trace/health-pass/store/actions';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { INotificationTemplate } from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';
import { NotificationTemplateSettingsService } from '@controlpanel/contact-trace/health-pass/services/notification-template-settings.service';
import { parseErrorResponse } from '@campus-cloud/shared/utils';


@Injectable()
export class NotificationTemplateApiEffects {
  constructor(private notificationService: NotificationTemplateSettingsService, private actions$: Actions) {
  }

  loadNotificationTemplates$ = createEffect(() => {

    return this.actions$.pipe(
      ofType(NotificationTemplatePageActions.enter),
      switchMap(() => {
          return this.notificationService.getAll().pipe(
            map((templates: INotificationTemplate[]) => NotificationTemplateApiActions.notificationTemplateLoadedSuccess({ templates })),
            catchError((error) => of(NotificationTemplateApiActions.notificationTemplateLoadedFail(error)))
          );
        }
      )
    );
  });

  updateHealthPass$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(NotificationTemplatePageActions.edit),
        concatMap((action) => {
          return this.notificationService.update(action.updatedTemplates)
            .pipe(map((templates: INotificationTemplate[]) =>
                NotificationTemplateApiActions.notificationTemplateUpdatedSuccess({ templates })),
              catchError((error) => of(NotificationTemplateApiActions.notificationTemplatesUpdatedFail(parseErrorResponse(error)))));
        }
        )
      );
    }
  );

}
