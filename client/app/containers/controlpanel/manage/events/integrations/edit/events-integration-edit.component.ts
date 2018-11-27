import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from './../../../../../../session';
import { EventIntegration } from './../model/integration.model';

@Component({
  selector: 'cp-events-integration-edit',
  templateUrl: './events-integration-edit.component.html',
  styleUrls: ['./events-integration-edit.component.scss']
})
export class EventsIntegrationEditComponent implements OnInit {
  @Input() eventIntegration;

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
      params,
      integrationId: this.eventIntegration.id
    };

    this.store.dispatch(new fromStore.EditIntegration(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    this.integration = new EventIntegration({ ...this.eventIntegration });
  }
}
