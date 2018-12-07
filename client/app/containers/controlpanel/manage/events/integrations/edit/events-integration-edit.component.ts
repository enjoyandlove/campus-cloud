import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { tap, map, takeUntil } from 'rxjs/internal/operators';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from './../../../../../../session';
import { EventIntegration } from '@client/app/libs/integrations/events/model';

@Component({
  selector: 'cp-events-integration-edit',
  templateUrl: './events-integration-edit.component.html',
  styleUrls: ['./events-integration-edit.component.scss']
})
export class EventsIntegrationEditComponent implements OnInit, OnDestroy {
  @Input() eventIntegration: EventIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  stores$;
  selectedHost;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(public session: CPSession, public store: Store<fromStore.IEventIntegrationState>) {}

  get defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;

    return new HttpParams().set('school_id', school_id);
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.value;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().set('school_id', school_id);

    const payload = {
      body,
      params,
      integrationId: this.eventIntegration.id
    };

    this.store.dispatch(new fromStore.EditIntegration(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    this.stores$ = this.store.select(fromStore.getIntegrationsHosts).pipe(
      takeUntil(this.destroy$),
      tap((stores: any[]) => {
        if (!stores.length) {
          const params = this.defaultParams;

          this.store.dispatch(new fromStore.GetHosts({ params }));
        }

        if (stores.length) {
          this.selectedHost = stores.find((s) => s.value === this.eventIntegration.store_id);
        }
      }),
      map((res) => (res.length ? res : [{ label: '---' }]))
    );

    this.form = EventIntegration.form(this.eventIntegration);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
