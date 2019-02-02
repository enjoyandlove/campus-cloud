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
import { IntegrationsUitlsService } from './../integrations.utils.service';
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
  selectedType: IItem | null;
  stores$: Observable<IStore[] | IItem[]>;

  constructor(
    public session: CPSession,
    public utils: CommonIntegrationUtilsService,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

  get defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;

    return IntegrationsUitlsService.commonParams(school_id);
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.getRawValue();
    const params = this.defaultParams;

    const payload = {
      body,
      params,
      integrationId: this.eventIntegration.id
    };

    this.store.dispatch(new fromStore.UpdateAndSync(payload));

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
      map((res) => (res.length ? res : [{ label: '---', action: null }]))
    );

    this.form = EventIntegration.form(this.eventIntegration);
    this.form.get('feed_url').disable();

    this.typesDropdown = this.utils.typesDropdown();
    this.selectedType = this.typesDropdown.find(
      (t) => t.action === this.form.get('feed_type').value
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
