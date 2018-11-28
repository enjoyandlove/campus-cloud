import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from './../../../../../../session';
import { EventIntegration } from './../model/integration.model';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-events-integrations-delete',
  templateUrl: './integrations-delete.component.html',
  styleUrls: ['./integrations-delete.component.scss']
})
export class EventsIntegrationsDeleteComponent implements OnInit {
  @Input() eventIntegration: EventIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

  resetModal() {
    this.teardown.emit();
  }

  onDelete() {
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().set('school_id', school_id);

    const payload = {
      params,
      integrationId: this.eventIntegration.id
    };

    this.store.dispatch(new fromStore.DeleteIntegration(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
