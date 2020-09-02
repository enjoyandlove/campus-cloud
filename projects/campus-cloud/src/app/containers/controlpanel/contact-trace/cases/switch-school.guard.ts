import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { appStorage } from '@campus-cloud/shared/utils';
import { AuthGuard } from '@campus-cloud/config/guards/auth.guard';
import { baseActionClass, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

@Injectable()
export class SwitchSchoolGuard implements CanActivate {

  constructor(public session: CPSession,
              private route: Router,
              private authGuard: AuthGuard,
              private store: Store<IHeader>,
              private cpI18n: CPI18nPipe) {}

  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    const schoolId: string = activatedRoute.queryParams['school_id'];
    if (schoolId && this.session.schoolId.toString() !== schoolId) {
      const school = this.session.g.get('schools')
        .find((schoolItem) => schoolItem.id.toString() === schoolId);

      if (school) {
        this.session.g.set('school', school);
        appStorage.set(appStorage.keys.DEFAULT_SCHOOL_ID, schoolId);
        this.authGuard.getSchoolConfig().then(() => {
          // @ts-ignore
          this.route.navigate(activatedRoute._urlSegment.segments.map((segment) => segment.path),
            activatedRoute.queryParams);
        });
      } else {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.transform('case_details_not_authorized')
          })
        );
        return false;
      }
    }
    return true;
  }
}
