import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, map, mapTo, share, startWith } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { EmailType, UnsubscribeFeedsService } from '@campus-cloud/services/social';

@Component({
  selector: 'cp-unsubscribe-feeds',
  templateUrl: './unsubscribe-generic.component.html',
  styleUrls: ['./unsubscribe-generic.component.scss'],
  providers: [UnsubscribeFeedsService, CPI18nPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscribeGenericComponent implements OnInit {
  message: string;
  view$: Observable<{ loading: boolean; error: boolean }>;

  constructor(private route: ActivatedRoute, public service: UnsubscribeFeedsService, public cpI18nPipe: CPI18nPipe) {}

  ngOnInit() {
    let adminId = this.route.snapshot.params['adminId'];
    let schoolId = this.route.snapshot.params['schoolId'];
    let emailTypes;
    if (this.route.snapshot.url[0].path == 'feeds') {
      emailTypes = [EmailType.feedEmailDigest];
      this.message = this.cpI18nPipe.transform('t_unsubscribe_feed_email_digest')
    } else if (this.route.snapshot.url[0].path == 'cases') {
      emailTypes = [EmailType.caseStatusChange, EmailType.contactTrace];
      this.message = this.cpI18nPipe.transform('t_unsubscribe_contact_trace_plus')
    } else {
      emailTypes = [];
    }

    const body = {
      admin_id: adminId,
      school_id: schoolId,
      email_types: emailTypes
    };

    const request$ = this.service.unsubscribe(body).pipe(share());
    const loading$ = request$.pipe(
      mapTo(false),
      startWith(true)
    );

    const error$ = request$.pipe(
      mapTo(false),
      startWith(false),
      catchError(() => of(true))
    );

    this.view$ = combineLatest([request$, loading$, error$]).pipe(
      map(([_, loading, error]) => {
        return {
          loading,
          error
        };
      }),
      catchError(() => {
        return of({
          error: true,
          loading: false
        });
      })
    );
  }
}
