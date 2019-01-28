import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@client/app/shared/components';
import { EventIntegration } from '@libs/integrations/events/model';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { ItemsIntegrationsUitlsService } from '../items-integrations.utils.service';

@Component({
  selector: 'cp-items-integrations-create',
  templateUrl: './integrations-create.component.html',
  styleUrls: ['./integrations-create.component.scss']
})
export class ItemsIntegrationsCreateComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  calendarId: number;
  typesDropdown: IItem[];

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    private utils: CommonIntegrationUtilsService,
    public store: Store<fromStore.IEventIntegrationState>
  ) {}

  get defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;

    return ItemsIntegrationsUitlsService.commonParams(school_id, this.calendarId.toString());
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
    const params = this.defaultParams;

    const payload = {
      body,
      params,
      calendarId: this.route.snapshot.params['calendarId']
    };

    this.store.dispatch(new fromStore.CreateAndSync(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    const schoolId = this.session.g.get('school').id;
    this.calendarId = this.route.snapshot.params['calendarId'];

    this.form = EventIntegration.form();
    this.form.get('school_id').setValue(schoolId);
    this.form.get('feed_obj_id').setValue(this.calendarId);
    this.form.get('feed_type').setValue(EventIntegration.types.ical);

    this.typesDropdown = this.utils
      .typesDropdown()
      .filter((type: IItem) => type.action === EventIntegration.types.ical);
  }
}
