import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from './../../../../../../session';
import { EventIntegration } from './../model/integration.model';

@Component({
  selector: 'cp-events-integrations-create',
  templateUrl: './integrations-create.component.html',
  styleUrls: ['./integrations-create.component.scss']
})
export class EventsIntegrationsCreateComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  integration: EventIntegration;

  constructor(public session: CPSession, public store: Store<fromStore.IEventIntegrationState>) {}

  resetModal() {
    this.integration.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    if (!this.integration.form.valid) {
      return;
    }

    const body = this.integration.form.value;
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

    this.integration = new EventIntegration();
    this.integration.form.get('school_id').setValue(schoolId);
  }
}
