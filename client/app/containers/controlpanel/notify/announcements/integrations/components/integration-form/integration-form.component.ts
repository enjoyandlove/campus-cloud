import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components';
import { CPI18nService, IStore } from '@shared/services';

@Component({
  selector: 'cp-announcements-integrations-form',
  templateUrl: './integration-form.component.html',
  styleUrls: ['./integration-form.component.scss']
})
export class AnnouncementsIntegrationFormComponent implements OnInit {
  @Input() selectedType;
  @Input() selectedSender;
  @Input() form: FormGroup;
  @Input() selectedPriority;
  @Input() typesDropdown: IItem[];
  @Input() priorityDropdown: IItem[];
  @Input() stores$: Observable<IStore[]>;

  audiences: IItem[];

  constructor(private cpI18n: CPI18nService) {}

  onTypeSelected(type: IItem) {
    this.form.get('feed_type').setValue(type.action);
  }

  onSenderSelected(sender: IStore) {
    this.form.get('store_id').setValue(sender.value);
  }

  onPrioritySelected(priority: IItem) {
    this.form.get('priority').setValue(priority.action);
  }

  ngOnInit() {
    this.audiences = [
      {
        action: null,
        label: this.cpI18n.translate('campus_wide')
      }
    ];
  }
}
