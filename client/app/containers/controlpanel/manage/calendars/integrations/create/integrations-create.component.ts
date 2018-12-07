import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@client/app/shared/components';
import { EventIntegration } from '@libs/integrations/events/model';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';

@Component({
  selector: 'cp-items-integrations-create',
  templateUrl: './integrations-create.component.html',
  styleUrls: ['./integrations-create.component.scss']
})
export class ItemsIntegrationsCreateComponent implements OnInit, OnDestroy {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  destroy$ = new Subject();
  typesDropdown: IItem[];

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    private utils: CommonIntegrationUtilsService,
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
      params
    };

    this.store.dispatch(new fromStore.PostIntegration(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    const schoolId = this.session.g.get('school').id;
    const calendarId = this.route.snapshot.params['calendarId'];

    this.form = EventIntegration.form();
    this.form.get('school_id').setValue(schoolId);
    this.form.get('store_id').setValue(calendarId);
    this.form.get('feed_type').setValue(EventIntegration.types.ical);

    this.typesDropdown = this.utils
      .typesDropdown()
      .filter((type: IItem) => type.action === EventIntegration.types.ical);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
