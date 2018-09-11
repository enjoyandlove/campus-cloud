import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CPI18nService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-providers-action-box',
  templateUrl: './providers-action-box.component.html',
  styleUrls: ['./providers-action-box.component.scss']
})
export class ServicesProviderActionBoxComponent {

  @Input() eventData;
  @Input() noProviders;

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() launchAddProviderModal: EventEmitter<null> = new EventEmitter();

  constructor(public cpI18n: CPI18nService) {}

  onDownload() {
    this.download.emit();
  }

  onLaunchProviderAdd() {
    this.launchAddProviderModal.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }
}
