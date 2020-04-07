import { map } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';

import { IPreviewResponse } from '../../../common/model';
import { IItem } from '@campus-cloud/shared/components/cp-dropdown';

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
  @Input() showPreview = false;
  @Input() selectedType: IItem;
  @Input() typesDropdown: Array<IItem>;
  @Input() previewError$: Observable<string>;
  @Input() previewLoading$: Observable<boolean>;
  @Input() preview$: Observable<IPreviewResponse[]>;
  @Input() stores$: Observable<Array<{ label: string; value: number }>>;

  @Output() loadPreview: EventEmitter<null> = new EventEmitter();
  @Output() hostSelected: EventEmitter<string> = new EventEmitter();

  _preview$: Observable<{
    errorStr: string;
    loading: boolean;
    data: null | IPreviewResponse[];
  }>;

  constructor() {}

  onHostSelected(store) {
    this.hostSelected.emit(store.hostType);
    this.form.get('feed_obj_id').setValue(store.value);
  }

  onTypeSelected({ action }) {
    this.form.get('feed_type').setValue(action);
  }

  onPreviewUrl() {
    this.loadPreview.emit();
  }

  ngOnInit() {
    this._preview$ = combineLatest([this.previewError$, this.previewLoading$, this.preview$]).pipe(
      map(([errorStr, loading, data]) => ({
        data,
        loading,
        errorStr
      }))
    );
  }
}
