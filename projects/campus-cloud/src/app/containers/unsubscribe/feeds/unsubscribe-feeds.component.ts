import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, mapTo, share, startWith, catchError } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { EmailType, UnsubscribeFeedsService } from '@campus-cloud/services/social';

@Component({
  selector: 'cp-unsubscribe-feeds',
  templateUrl: './unsubscribe-feeds.component.html',
  styleUrls: ['./unsubscribe-feeds.component.scss'],
  providers: [UnsubscribeFeedsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscribeFeedsComponent implements OnInit {
  adminId: string;
  schoolId: string;
  view$: Observable<{ loading: boolean; error: boolean }>;

  constructor(private route: ActivatedRoute, public service: UnsubscribeFeedsService) {}

  ngOnInit() {
    this.adminId = this.route.snapshot.params['adminId'];
    this.schoolId = this.route.snapshot.params['schoolId'];

    const body = {
      admin_id: this.adminId,
      school_id: this.schoolId,
      email_type: EmailType.feedEmailDigest
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
