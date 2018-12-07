import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IEventIntegration, EventIntegration } from '@libs/integrations/events/model';

@Component({
  selector: 'cp-items-integrations-edit',
  templateUrl: './integrations-edit.component.html',
  styleUrls: ['./integrations-edit.component.scss']
})
export class ItemsIntegrationEditComponent implements OnInit, OnDestroy {
  @Input() eventIntegration: IEventIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
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
    const calendarId = this.route.snapshot.params['calendarId'];
    this.form = EventIntegration.form(this.eventIntegration);

    this.form.get('store_id').setValue(calendarId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
