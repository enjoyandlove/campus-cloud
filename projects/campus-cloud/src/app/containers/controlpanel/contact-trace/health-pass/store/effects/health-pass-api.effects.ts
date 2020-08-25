import { HealthPassService } from '@controlpanel/contact-trace/health-pass/services/health-pass.service';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { HealthPassApiActions, HealthPassPageActions } from '@controlpanel/contact-trace/health-pass/store/actions';
import { catchError, concatMap, map } from 'rxjs/operators';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';
import { of } from 'rxjs';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { Injectable } from '@angular/core';


@Injectable()
export class HealthPassApiEffects {
  constructor(private healthPassService: HealthPassService, private actions$: Actions) {
  }
  loadHealthPass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HealthPassPageActions.enter),
      concatMap((action) =>
        this.healthPassService
          .getHealthPass(action.school_id)
          .pipe(
            map((healthPass: IHealthPass[]) => HealthPassApiActions.healthPassLoadedSuccess({ healthPass })),
            catchError((error) => of(HealthPassApiActions.healthPassLoadedFail(parseErrorResponse(error))))
          )
      )
    )
  );
  updateHealthPass$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HealthPassPageActions.edit),
      concatMap((action) =>
        this.healthPassService
          .updateHealthPass(action.healthPassList, action.school_id)
          .pipe(map((healthPassList: IHealthPass[]) => HealthPassApiActions.healthPassUpdatedSuccess({ healthPassList })),
            catchError((error) => of(HealthPassApiActions.healthPassUpdatedFail(parseErrorResponse(error)))))
      )
    );
}
  );

}
