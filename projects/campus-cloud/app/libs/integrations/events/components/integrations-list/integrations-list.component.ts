import { Component, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@campus-cloud/app/shared/pipes';
import { IEventIntegration } from './../../model';
import { SyncStatus } from '../../../common/model';
@Component({
  selector: 'cp-event-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class EventIntegrationsListComponent {
  @Input() integrations$: Observable<IEventIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IEventIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;
}
