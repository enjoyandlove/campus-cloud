import { Input, EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { CPI18nService } from '@shared/services/i18n.service';
import { FeedIntegration } from './../../model/integration.model';

@Component({
  selector: 'cp-integrations-delete',
  templateUrl: './integrations-delete.component.html',
  styleUrls: ['./integrations-delete.component.scss']
})
export class IntegrationsDeleteComponent implements OnInit {
  @Input() eventIntegration: FeedIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<FeedIntegration> = new EventEmitter();

  buttonData;

  constructor(private cpI18n: CPI18nService) {}

  onDelete() {
    this.deleteClick.emit(this.eventIntegration);
    this.teardown.emit();
  }

  ngOnInit(): void {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
