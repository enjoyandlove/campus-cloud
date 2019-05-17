import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() pkdbUrl: string;
  @Input() showHosts = true;
  @Input() selectedType: IItem;
  @Input() typesDropdown: Array<IItem>;
  @Input() stores$: Observable<Array<{ label: string; value: number }>>;

  @Output() hostSelected: EventEmitter<string> = new EventEmitter();

  constructor() {}

  onHostSelected(store) {
    this.hostSelected.emit(store.hostType);
    this.form.get('feed_obj_id').setValue(store.value);
  }

  onTypeSelected({ action }) {
    this.form.get('feed_type').setValue(action);
  }

  ngOnInit(): void {}
}
