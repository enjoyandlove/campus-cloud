import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { tap, map, takeUntil } from 'rxjs/internal/operators';
import { Subject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { IItem } from '@campus-cloud/shared/components';
import { IStore, ZendeskService } from '@campus-cloud/shared/services';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { IEventIntegration, EventIntegration } from '@campus-cloud/libs/integrations/events/model';

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
  eventIntegrationPkdbUrl = `${ZendeskService.getUrl('articles/360021952274')}`;

  constructor(public store: Store<fromStore.IEventIntegrationState>) {}

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.getRawValue();

    const payload = {
      body,
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
          this.store.dispatch(new fromStore.GetHosts());
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

    this.typesDropdown = CommonIntegrationUtilsService.typesDropdown();
    this.selectedType = this.typesDropdown.find(
      (t) => t.action === this.form.get('feed_type').value
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
