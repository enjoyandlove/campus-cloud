import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components/cp-dropdown';

@Component({
  selector: 'cp-events-integrations-form',
  templateUrl: './integrations-form.component.html',
  styleUrls: ['./integrations-form.component.scss']
})
export class EventIntegrationFormComponent implements OnInit {
  @Input() selectedHost;
  @Input() form: FormGroup;
  @Input() showHosts = true;
  @Input() selectedType: IItem;
  @Input() typesDropdown: Array<IItem>;
  @Input() stores$: Observable<Array<{ label: string; value: number }>>;

  constructor() {}

  onHostSelected({ value }) {
    this.form.get('feed_obj_id').setValue(value);
  }

  onTypeSelected({ action }) {
    this.form.get('feed_type').setValue(action);
  }

  ngOnInit(): void {}
}
