import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components/cp-dropdown';
import { CommonIntegrationUtilsService } from './../../../common/providers';

@Component({
  selector: 'cp-events-integrations-form',
  templateUrl: './integrations-form.component.html',
  styleUrls: ['./integrations-form.component.scss']
})
export class EventIntegrationFormComponent implements OnInit {
  @Input() form: FormGroup;

  @Input() selectedHost;

  @Input() stores$: Observable<Array<{ label: string; value: number }>>;

  selectedItem;
  typesDropdown: Array<IItem>;

  constructor(private utils: CommonIntegrationUtilsService) {}

  onHostSelected({ value }) {
    this.form.get('store_id').setValue(value);
  }

  onTypeSelected({ action }) {
    this.form.get('feed_type').setValue(action);
  }

  onImageUpload(image) {
    this.form.get('poster_url').setValue(image);
    this.form.get('poster_thumb_url').setValue(image);
  }

  ngOnInit(): void {
    this.typesDropdown = this.utils.typesDropdown();
  }
}
