import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { IItem } from '@campus-cloud/shared/components';
import { ZendeskService } from '@campus-cloud/shared/services';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { IEventIntegration, EventIntegration } from '@campus-cloud/libs/integrations/events/model';

@Component({
  selector: 'cp-items-integrations-edit',
  templateUrl: './integrations-edit.component.html',
  styleUrls: ['./integrations-edit.component.scss']
})
export class ItemsIntegrationEditComponent implements OnInit, OnDestroy {
  @Input() eventIntegration: IEventIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  calendarId: number;
  typesDropdown: IItem[];
  destroy$ = new Subject();
  calendarItemIntegrationPkdbUrl = `${ZendeskService.getUrl('articles/360022156453')}`;

  constructor(
    private route: ActivatedRoute,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

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
      calendarId: this.calendarId,
      integrationId: this.eventIntegration.id
    };

    this.store.dispatch(new fromStore.UpdateAndSync(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    this.calendarId = this.route.snapshot.params['calendarId'];
    this.form = EventIntegration.form(this.eventIntegration);
    this.form.get('feed_url').disable();

    this.form.get('feed_obj_id').setValue(this.calendarId);

    this.typesDropdown = CommonIntegrationUtilsService.typesDropdown().filter(
      (type: IItem) => type.action === EventIntegration.types.ical
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
