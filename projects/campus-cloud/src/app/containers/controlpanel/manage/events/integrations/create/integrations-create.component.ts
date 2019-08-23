import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { takeUntil, map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { IStore, ZendeskService } from '@campus-cloud/shared/services';
import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';

@Component({
  selector: 'cp-events-integrations-create',
  templateUrl: './integrations-create.component.html',
  styleUrls: ['./integrations-create.component.scss']
})
export class EventsIntegrationsCreateComponent implements OnInit, OnDestroy {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  hostType: string;
  destroy$ = new Subject();
  typesDropdown: IItem[];
  selectedType: IItem | null;
  stores$: Observable<IStore[] | IItem[]>;
  eventIntegrationPkdbUrl = `${ZendeskService.getUrl('articles/360021952274')}`;

  constructor(public session: CPSession, public store: Store<fromStore.IEventIntegrationState>) {}

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.value;

    const payload = {
      body,
      hostType: this.hostType
    };

    this.store.dispatch(new fromStore.CreateAndSync(payload));

    this.resetModal();
  }

  onHostSelected(host_type) {
    this.hostType = host_type;
  }

  ngOnInit(): void {
    const schoolId = this.session.g.get('school').id;

    this.form = EventIntegration.form();
    this.form.get('school_id').setValue(schoolId);

    this.stores$ = this.store.select(fromStore.getIntegrationsHosts).pipe(
      takeUntil(this.destroy$),
      tap((stores: IStore[]) => {
        if (!stores.length) {
          this.store.dispatch(new fromStore.GetHosts());
        }
      }),
      map((res) => (res.length ? res : [{ label: '---', action: null }]))
    );

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
