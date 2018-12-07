import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { tap, map, takeUntil } from 'rxjs/internal/operators';
import { HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@client/app/shared/components';
import { IStore } from '@shared/services/store.service';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { IEventIntegration, EventIntegration } from '@libs/integrations/events/model';

@Component({
  selector: 'cp-events-integration-edit',
  templateUrl: './events-integration-edit.component.html',
  styleUrls: ['./events-integration-edit.component.scss']
})
export class EventsIntegrationEditComponent implements OnInit, OnDestroy {
  @Input() eventIntegration: IEventIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  selectedHost;
  form: FormGroup;
  typesDropdown: IItem[];
  destroy$ = new Subject();
  stores$: Observable<IStore[] | [{ label: '---'; value: number }]>;

  constructor(
    public session: CPSession,
    public utils: CommonIntegrationUtilsService,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

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
      tap((stores: IStore[]) => {
        if (!stores.length) {
          const params = this.defaultParams;

          this.store.dispatch(new fromStore.GetHosts({ params }));
        } else {
          setTimeout(() => {
            const selectedHostLookup = (s) => s.value === this.eventIntegration.feed_obj_id;

            this.selectedHost = stores.find(selectedHostLookup);
          }, 1);
        }
      }),
      map((res) => (res.length ? res : [{ label: '---', value: null }]))
    );

    this.form = EventIntegration.form(this.eventIntegration);
    this.typesDropdown = this.utils.typesDropdown();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
